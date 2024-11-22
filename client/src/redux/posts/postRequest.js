import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { socket } from "api/config";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import convertLineBreak from "utils/convertLineBreak";

export const addNewPost = createAsyncThunk(
  "posts/create",
  async ({ data, reset }) => {
    try {
      var formData = new FormData();
      const { type, content } = data;
      if (type === "image") {
        const { publicImg } = data;
        formData.append("content", convertLineBreak(content));
        formData.append("type", type);
        if (publicImg && publicImg.length > 0) {
          for (const img of publicImg) formData.append("publicImg", img);
        }
      } else if (type === "video") {
        for (const key in data) formData.append(key, data[key]);
      }
      const res = await axios({
        method: "POST",
        url: "/posts/public",
        data:
          data?.type === "theme"
            ? { ...data, content: convertLineBreak(content) }
            : formData,
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: "Bearer " + Cookies.get("tokens"),
        },
      });
      reset({
        content: "",
        theme: "",
        publicImg: null,
        videoUpload: null,
      });
      const audio = new Audio(
        "/audio/short-success-sound-glockenspiel-treasure-video-game-6346.mp3"
      );
      audio.play();
      toast.success("Create successfully post", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      socket.emit("send-notify-post", { ...data, newPost: res?.data });
      return res.data;  // Trả về bài viết mới
    } catch (error) {
      toast.error("Failed. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      throw new Error(error);
    }
  }
);

export const getPostList = createAsyncThunk(
  "posts/list",
  async (query = "", { rejectWithValue, fulfillWithValue }) => {
    try {
      const res = await axios.get("/posts" + query, {
        headers: {
          authorization: "Bearer " + Cookies.get("tokens"),
        },
      });
      return fulfillWithValue(res.data?.listPost || [res.data]);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const retweetPost = createAsyncThunk(
  "posts/retweet",
  async ({ content, retweetPostID }, { rejectWithValue }) => {
    try {
      const res = await axios({
        method: "POST",
        url: "/posts/retweet",
        data: { content, retweetPostID },
        headers: {
          authorization: "Bearer " + Cookies.get("tokens"),
        },
      });
      toast.success("Retweeted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return res.data;
    } catch (error) {
      toast.error("Failed to retweet. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return rejectWithValue(error.response.data);
    }
  }
);
