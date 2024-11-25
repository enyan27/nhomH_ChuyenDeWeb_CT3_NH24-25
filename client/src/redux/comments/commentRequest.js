import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { socket } from "api/config";
import Cookies from "js-cookie";
import convertLineBreak from "utils/convertLineBreak";

export const getCommentList = createAsyncThunk(
  "comments/list",
  async (postId = "") => {
    try {
      const res = await axios.get("/comments/" + postId, {
        headers: {
          authorization: "Bearer " + Cookies.get("tokens"),
        },
      });
      return res.data?.listComment;
    } catch (error) {
      console.log(error);
    }
  }
);

export const addNewComment = createAsyncThunk(
  "comments/add",
  async ({ postID = "", content = "" }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "/comments/public/" + postID,
        { content: convertLineBreak(content) },
        {
          headers: {
            authorization: "Bearer " + Cookies.get("tokens"),
          },
        }
      );
      const { authorID, userID } = res.data;
      socket.emit("sendComment", { ...res?.data });
      authorID !== userID._id &&
        socket.emit("send-notify-comment", { ...res?.data, postID, content });
      return true;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Fix UI - Add reply
export const addReplyToComment = createAsyncThunk(
  "comments/addReply",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `/comments/${commentId}/replies`,
        { content },
        {
          headers: {
            authorization: "Bearer " + Cookies.get("tokens"),
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const editComment = createAsyncThunk(
  "comments/edit",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `/comments/${commentId}`,
        { content: convertLineBreak(content) },
        {
          headers: {
            authorization: "Bearer " + Cookies.get("tokens"),
          },
        }
      );
      return { commentId, content: res.data.updatedContent }; // giả định API trả về nội dung cập nhật
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);