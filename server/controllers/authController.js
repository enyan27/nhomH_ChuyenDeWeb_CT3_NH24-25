const UserModel = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Hàm đăng ký người dùng
const handleRegister = asyncHandler(async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    await UserModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      avatar:
        req.body.gender === "male"
          ? "/uploads/avatar-man.png"
          : "/uploads/avatar-woman.png",
      password: hash,
      gender: req.body.gender,
    });
    res.json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    throw new Error(error);
  }
});

// Hàm đăng nhập
const handleLogin = asyncHandler(async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (user) {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        const { _id, email, firstName, lastName, avatar } = user;
        const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1h" });  // Tạo lại token sau khi thay đổi mật khẩu
        res.cookie("tokens", token, {
          httpOnly: true,
          secure: false,  // Đảm bảo môi trường đúng
          path: "/",
          sameSite: "strict",
        });

        res.json({ _id, firstName, lastName, email, avatar, token });
      } else {
        res.status(400).json({ message: "Incorrect password" });
      }
    } else {
      res.status(400).json({ message: "Email not found" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Hàm thay đổi mật khẩu
const handleChangePassword = asyncHandler(async (req, res) => {
  const user = req.user;
  try {
    const { currentPassword, newPassword } = req.body;
    const checkPassword = await bcrypt.compare(currentPassword, user.password);
    if (checkPassword) {
      const hash = await bcrypt.hash(newPassword, 10);
      await UserModel.findByIdAndUpdate(user._id, { password: hash });
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(400).json({ message: "Current password is incorrect!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Hàm đăng xuất
const handleLogout = asyncHandler((req, res) => {
  try {
    res.clearCookie("tokens");
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Tạo transporter gửi email
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Gửi mã xác nhận qua email
const sendResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Kiểm tra email có tồn tại trong cơ sở dữ liệu không
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    // Tạo mã xác nhận ngẫu nhiên
    const resetCode = crypto.randomBytes(3).toString("hex");
    const resetCodeExpires = Date.now() + 3600000; // Mã hết hạn trong 1 giờ

    // Lưu mã xác nhận và thời gian hết hạn vào cơ sở dữ liệu
    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

    // Gửi email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset your password",
      text: `Here is your reset code: ${resetCode}. It will expire in 1 hour.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        return res.status(500).json({ message: "Failed to send email" });
      }
      res.status(200).json({ message: "Reset email sent successfully" });
    });
  } catch (error) {
    console.error("Error in sendResetEmail:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Xác minh mã xác nhận
const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user || user.resetCode !== code || user.resetCodeExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired reset code" });
  }

  user.resetCode = null;
  user.resetCodeExpires = null;
  await user.save();

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });
  res.status(200).json({ message: "Code verified successfully", token });
};

// Đặt lại mật khẩu mới
const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "Email not found" });

  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: "Password has been reset successfully" });
};

module.exports = {
  handleRegister,
  handleLogin,
  handleLogout,
  handleChangePassword,
  sendResetEmail,
  verifyResetCode,
  resetPassword,
};
