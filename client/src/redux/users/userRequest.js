import axios from "api/config";
import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const userProfile = createAsyncThunk(
  "user/info",
  async (userID, { rejectWithValue, fulfillWithValue }) => {
    try {
      const res = await axios.get("/users/" + userID, {
        headers: {
          authorization: "Bearer " + Cookies.get("tokens"),
        },
      });
      let { userInfo, postCount, yourSelf } = res.data;
      return fulfillWithValue({
        userInfo: {
          ...userInfo,
          postCount,
        },
        yourSelf: yourSelf,
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
