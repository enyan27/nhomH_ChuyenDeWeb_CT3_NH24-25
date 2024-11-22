import { createSlice } from "@reduxjs/toolkit";
import { addNewPost, getPostList, retweetPost } from "./postRequest";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    getPost: {
      listPost: [],
      loading: true,
      error: null,
    },
    createPost: {
      success: false,
      loading: false,
      error: false,
    },
  },
  reducers: {
    setModeComment: (state, { payload }) => {
      state.getPost.listPost = state.getPost.listPost.map((post) =>
        post._id === payload
          ? { ...post, modeComment: !post.modeComment }
          : { ...post }
      );
    },
    deletePost: (state, { payload }) => {
      state.getPost.listPost = state.getPost.listPost.filter(
        (post) => post._id !== payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Retweet Post
      .addCase(retweetPost.fulfilled, (state, { payload }) => {
        // Bài viết retweet mới
        state.getPost.listPost = [payload, ...state.getPost.listPost];
        // Tìm bài viết gốc (bài viết được retweet)
        const originalPost = state.getPost.listPost.find(
          (post) => post._id === payload.retweetPost._id
        );
        if (originalPost) {
          originalPost.retweetCount += 1;
          originalPost.isRetweeted = true;
        }
      })
      .addCase(retweetPost.rejected, (state, { payload }) => {
        state.createPost.error = payload;
      })
      // Add New Post
      .addCase(addNewPost.fulfilled, (state, { payload }) => {
        state.createPost.success = true;
        state.createPost.loading = false;
        state.getPost.listPost = [payload, ...state.getPost.listPost];
      })
      .addCase(addNewPost.pending, (state) => {
        state.createPost.loading = true;
        state.createPost.error = false;
      })
      .addCase(addNewPost.rejected, (state) => {
        state.createPost.loading = false;
        state.createPost.error = true;
      })
      // Get Post List
      .addCase(getPostList.fulfilled, (state, { payload }) => {
        state.getPost.listPost = payload;
        state.getPost.loading = false;
      })
      .addCase(getPostList.pending, (state) => {
        state.getPost.loading = true;
        state.getPost.error = null;
      })
      .addCase(getPostList.rejected, (state, payload) => {
        state.getPost.loading = false;
        state.getPost.error = payload;
      });
  },
});

export const { setModeComment, deletePost } = postSlice.actions;

export default postSlice.reducer;
