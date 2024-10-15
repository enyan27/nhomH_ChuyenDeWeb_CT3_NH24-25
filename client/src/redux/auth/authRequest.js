import axios from "api/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { logoutAccount } from "./authSlice";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ userData, ...others }) => {
    const { reset, setError, navigate } = { ...others };
    try {
      const res = await axios.post("/auth/login", userData);
      reset({ email: "", password: "" });
      Cookies.set("tokens", res.data?.token, {
        expires: 30,
        path: "/",
      });
      navigate("/home");
      return res.data;
    } catch (error) {
      if (error.response.status === 400) {
        setError("email", { message: "" });
        setError("password", { message: "Email or password is not correct" });
      }
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ userData, ...others }) => {
    const { initialValue, reset, setError, navigate } = { ...others };
    try {
      const res = await axios.post("/auth/register", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      reset(initialValue);
      navigate("/login");
      toast.success("Register success", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return res.data;
    } catch (error) {
      if (error.response.status === 400) {
        setError("email", { message: "This email already existed" });
      }
    }
  }
);

export const logoutUser = async (dispatch) => {
  try {
    await axios.post("/auth/logout");
    dispatch(logoutAccount());
    Cookies.remove("tokens");
    window.location.href = "/login";
  } catch (error) {
    console.log(error);
  }
};
