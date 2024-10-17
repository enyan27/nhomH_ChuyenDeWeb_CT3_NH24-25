import axios from "api/config";
import Cookies from "js-cookie";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { loginRefresh } from "redux/auth/authSlice";

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

export const updateUserProfile = createAsyncThunk(
  "users/update",
  async ({ data, userID, dispatch }) => {
    try {
      var formData = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (value) formData.append(key, value);
      }

      const res = await axios({
        method: "PUT",
        url: "/users/update-info",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: "Bearer " + Cookies.get("tokens"),
        },
      });
      toast.success("Update successfully profile", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      dispatch(userProfile(userID));
      dispatch(loginRefresh(res?.data));
      return 1;
    } catch (err) {
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
      throw new Error(err);
    }
  }
);
