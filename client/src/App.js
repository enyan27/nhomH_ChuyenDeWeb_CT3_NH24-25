import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "swiper/scss";
import "swiper/scss/navigation";
import MainLayout from "layout/MainLayout";
import LoginPage from "views/LoginPage";
import RegisterPage from "views/RegisterPage";
import HomePage from "views/HomePage";
import FriendPage from "views/FriendPage";
import ProfilePage from "views/ProfilePage";
import PostDetailPage from "views/PostDetailPage";
import ChatPage from "views/ChatPage";
import SavedPage from "views/SavedPage";
import NotifyPage from "views/NotifyPage";
import MessagePage from "views/MessagePage";
import NotFoundPage from "views/NotFoundPage";
import CommingSoon from "views/CommingSoonPage";
import FilterPage from "views/FilterPage";
import ForgotPasswordPage from "views/ForgotPasswordPage";
import MusicPage from "views/MusicPage";
import Settings from "views/Settings";
import Admin from "views/Admin";
import User from "views/User";
import Dashboard from "views/Dashboard";
import Posts from "views/Posts"

import AdminMusic from "views/AdminMusic";
import MusicList from "views/MusicList";



function App() {
  return (
    <Suspense>
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
        <Route path="/forgot-password" element={<ForgotPasswordPage></ForgotPasswordPage>}></Route>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/friends" element={<FriendPage />} />
          <Route path="/notify" element={<NotifyPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/post-saved" element={<SavedPage />} />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/chats/t/:id" element={<MessagePage />} />
          <Route path="/search" element={<FilterPage></FilterPage>}></Route>
          <Route path="/settings" element={<Settings></Settings>}></Route>
          <Route path="/comming-soon" element={<CommingSoon />} />

        </Route>

        <Route path="/admin/music" element={<AdminMusic/>} />
        <Route path="/admin/list" element={<MusicList />} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/admin/users" element={<User/>} />
        <Route path="/admin/settings" element={<Settings/>} />
        <Route path="/admin/dashboard" element={<Dashboard/>} />
        <Route path="/admin/posts" element={<Posts/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}


export default App;
