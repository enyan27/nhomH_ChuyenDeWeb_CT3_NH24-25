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
      localStorage.setItem("role", res.data?.role);
      reset({ email: "", password: "" });
      Cookies.set("tokens", res.data?.token, {
        expires: 30,
        path: "/",
      });
      if (res.data.role == 1) {
        navigate("/admin");
      }else{
        navigate("/home");
      }
      console.log(res.data.role);
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

// Gửi email chứa mã xác nhận
export const sendResetEmail = ({ email, captchaToken }) => async (dispatch) => {
  try {
    const response = await axios.post("/auth/send-reset-email", { email, captchaToken });
    dispatch({ type: "SEND_RESET_EMAIL_SUCCESS", payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: "SEND_RESET_EMAIL_FAILURE", payload: error.response.data });
    throw error;
  }
};

// Xác minh mã xác nhận
export const verifyResetCode = ({ email, code }) => async (dispatch) => {
  try {
    const response = await axios.post("/auth/verify-reset-code", { email, code });
    dispatch({ type: "VERIFY_RESET_CODE_SUCCESS", payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: "VERIFY_RESET_CODE_FAILURE", payload: error.response.data });
    throw error;
  }
};

// Đặt lại mật khẩu mới
export const resetPassword = ({ email, password }) => async (dispatch) => {
  try {
    const response = await axios.post("/auth/reset-password", { email, password });
    dispatch({ type: "RESET_PASSWORD_SUCCESS", payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: "RESET_PASSWORD_FAILURE", payload: error.response.data });
    throw error;
  }
};