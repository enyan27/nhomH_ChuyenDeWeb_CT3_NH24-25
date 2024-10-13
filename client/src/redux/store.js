import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import postReducer from "./posts/postSlice";
import commentSlice from "./comments/commentSlice";

export const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
    posts: postReducer,
    comments: commentSlice,
  }),
});
