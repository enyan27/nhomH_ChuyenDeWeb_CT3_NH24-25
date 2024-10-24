import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "swiper/scss";
import "swiper/scss/navigation";
import MainLayout from "layout/MainLayout";
import LoginPage from "views/LoginPage";
import RegisterPage from "views/RegisterPage";
import HomePage from "views/HomePage";
<<<<<<< HEAD
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
<<<<<<< HEAD
=======
import MainLayout from "layout/MainLayout";
import ForgotPasswordPage from "views/ForgotPasswordPage";

>>>>>>> 2-auth/login,logout,register
=======
import ForgotPasswordPage from "views/ForgotPasswordPage";
>>>>>>> origin/main
function App() {
  return (
    <Suspense>
      <Routes>
<<<<<<< HEAD
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
=======
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
        <Route path="/forgot-password" element={<ForgotPasswordPage></ForgotPasswordPage>}></Route>
>>>>>>> 2-auth/login,logout,register
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
