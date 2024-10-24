import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "views/LoginPage";
import RegisterPage from "views/RegisterPage";
import HomePage from "views/HomePage";
import MainLayout from "layout/MainLayout";
import ForgotPasswordPage from "views/ForgotPasswordPage";

function App() {
  return (
    <Suspense>
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
        <Route path="/forgot-password" element={<ForgotPasswordPage></ForgotPasswordPage>}></Route>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage></HomePage>}></Route>
        </Route>
        
      </Routes>
    </Suspense>
  );
}

export default App;
