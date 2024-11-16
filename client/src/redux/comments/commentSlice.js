import { createSlice } from "@reduxjs/toolkit";
import { addNewComment, getCommentList, addReplyToComment } from "./commentRequest";

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    getComment: {
      listComment: [],
      loading: false,
      error: false,
    },
    addComment: {
      success: false,
      loading: false,
      error: null,
    },
  },
  reducers: {
    newComment: (state, { payload }) => {
      state.getComment.listComment.unshift(payload);
    },
    deleteComment: (state, { payload }) => {
      state.getComment.listComment = state.getComment.listComment.filter(
        (comment) => comment._id !== payload
      );
    }, 
    updateReplies: (state, { payload }) => {
      const { commentId, replies } = payload;
      const comment = state.getComment.listComment.find((c) => c._id === commentId);
      if (comment) {
        comment.replies = replies;
      }
    }, 
  },  
  extraReducers: (builder) => {
    builder
      .addCase(getCommentList.fulfilled, (state, { payload }) => {
        state.getComment.listComment = payload;
        state.getComment.loading = false;
      })
      .addCase(getCommentList.pending, (state) => {
        state.getComment.loading = true;
        state.getComment.error = false;
      })
      .addCase(getCommentList.rejected, (state) => {
        state.getComment.loading = false;
        state.getComment.error = true;
      });
    builder
      .addCase(addNewComment.fulfilled, (state) => {
        state.addComment.success = true;
        state.addComment.loading = false;
      })
      .addCase(addNewComment.pending, (state) => {
        state.addComment.loading = true;
        state.addComment.error = null;
      })
      .addCase(addNewComment.rejected, (state, { payload }) => {
        state.addComment.loading = false;
        state.addComment.error = payload;
      });
    builder
      .addCase(addReplyToComment.fulfilled, (state, { payload }) => {
        const comment = state.getComment.listComment.find(
          (c) => c._id === payload.commentId
        );
        if (comment) {
          comment.replies = payload.replies;
        }
      });
  },
});

export const { newComment, deleteComment, updateReplies } = commentSlice.actions;

export default commentSlice.reducer;
