import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "swiper/scss";
import "swiper/scss/navigation";
import LoginPage from "views/LoginPage";
import RegisterPage from "views/RegisterPage";
import HomePage from "views/HomePage";
import PostDetailPage from "views/PostDetailPage";
import SavedPage from "views/SavedPage";
import NotFoundPage from "views/NotFoundPage";
import MainLayout from "layout/MainLayout";
import CommingSoon from "views/CommingSoonPage";

function App() {
  return (
    <Suspense>
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
        
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage></HomePage>}></Route>
          <Route path="/post/:id" element={<PostDetailPage></PostDetailPage>}></Route>
          <Route path="/post-saved" element={<SavedPage></SavedPage>}></Route>
          
          <Route path="/comming-soon" element={<CommingSoon></CommingSoon>}></Route>
        </Route>

        <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
      </Routes>
    </Suspense>
  );
}

export default App;
