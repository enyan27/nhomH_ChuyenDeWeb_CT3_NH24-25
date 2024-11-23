// redux/music/musicSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { getMusicList, deleteMusic } from "./musicRequest";

const initialState = {
  requests: [],  // Danh sách nhạc
  loading: false, // Trạng thái loading khi đang fetch
  error: null,  // Lỗi nếu có
};

const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Lấy danh sách nhạc
      .addCase(getMusicList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMusicList.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload; // Lưu dữ liệu nhạc vào state
      })
      .addCase(getMusicList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Lưu lỗi nếu có
      });
  },
});

export default musicSlice.reducer;
