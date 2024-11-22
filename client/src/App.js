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
import PremiumPage from "views/PremiumPage";
import PaymentPage from "views/PaymentPage";

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
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/chats/t/:id" element={<MessagePage />} />
          <Route path="/search" element={<FilterPage></FilterPage>}></Route>
          <Route path="/settings" element={<Settings></Settings>}></Route>
          <Route path="/comming-soon" element={<CommingSoon />} />

        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}


export default App;
