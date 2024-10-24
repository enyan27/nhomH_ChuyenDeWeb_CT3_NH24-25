import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Authentication from "layout/Authentication";
import ButtonGradient from "components/button/ButtonGradient";
import ReCAPTCHA from "react-google-recaptcha";
import { sendResetEmail, verifyResetCode, resetPassword } from "redux/auth/authRequest";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

const siteKey = "6Lf9P3kqAAAAAAtByQrol0tivfMWioR3d_cg_sza";

const ForgotPasswordPage = () => {
  const navigate = useNavigate(); // Hook điều hướng
  const dispatch = useDispatch();
  const { handleSubmit, register, formState: { errors }, reset } = useForm();
  const [captchaToken, setCaptchaToken] = useState(null);
  const [step, setStep] = useState(1); // Biến điều khiển các bước
  const [email, setEmail] = useState(""); // Lưu email

  // Hàm xử lý CAPTCHA
  const handleCaptchaChange = (token) => setCaptchaToken(token);

  // Bước 1: Gửi email để lấy mã xác minh
  const handleSendEmail = async (values) => {
    if (captchaToken) {
      setEmail(values.email); // Lưu email
      try {
        await dispatch(sendResetEmail({ email: values.email, captchaToken }));
        setStep(2); // Chuyển sang bước 2 (Xác minh mã)
      } catch (error) {
        alert("Failed to send email. Please try again.");
      }
    } else {
      alert("Please complete the CAPTCHA.");
    }
  };

  // Bước 2: Xác minh mã đã gửi qua email
  const handleVerifyCode = async (values) => {
    if (values.email !== email) {
      alert("The email does not match the one you provided.");
      return;
    }

    try {
      await dispatch(verifyResetCode({ email, code: values.code }));
      setStep(3); // Chuyển sang bước 3 (Đặt lại mật khẩu)
    } catch (error) {
      alert("Invalid verification code. Please try again.");
    }
  };

  // Bước 3: Đặt lại mật khẩu
  const handleResetPassword = async (values) => {
    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await dispatch(resetPassword({ email, password: values.password }));
      alert("Password reset successfully!");
      reset(); // Reset form
      setStep(1); // Quay lại bước 1

      // Điều hướng đến trang đăng nhập
      navigate("/login");
    } catch (error) {
      alert("Failed to reset password. Please try again.");
    }
  };

  // Render form
  return (
    <Authentication heading="Forgot Password">
      <form onSubmit={handleSubmit(
        step === 1 ? handleSendEmail : 
        step === 2 ? handleVerifyCode : 
        handleResetPassword
      )}>
        {step === 1 && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <span>{errors.email.message}</span>}
            <ReCAPTCHA sitekey={siteKey} onChange={handleCaptchaChange} />
            <ButtonGradient type="submit">Send Verification Code</ButtonGradient>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email} // Hiển thị email
              disabled
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <span>{errors.email.message}</span>}

            <input
              type="text"
              name="code"
              placeholder="Enter verification code"
              {...register("code", { required: "Verification code is required" })}
            />
            {errors.code && <span>{errors.code.message}</span>}
            <ButtonGradient type="submit">Verify Code</ButtonGradient>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <span>{errors.password.message}</span>}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              {...register("confirmPassword", { required: "Confirm your password" })}
            />
            {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
            <ButtonGradient type="submit">Reset Password</ButtonGradient>
          </>
        )}
      </form>
    </Authentication>
  );
};

export default ForgotPasswordPage;
