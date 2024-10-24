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
function App() {
  return (
    <Suspense>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/friends" element={<FriendPage />} />
          <Route path="/notify" element={<NotifyPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/post-saved" element={<SavedPage />} />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/chats/t/:id" element={<MessagePage />} />
          <Route path="/search" element={<FilterPage></FilterPage>}></Route>
          <Route path="/comming-soon" element={<CommingSoon />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}


export default App;
