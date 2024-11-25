const UserModel = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const handleRegister = asyncHandler(async (req, res) => {
  try {
    const username = await UserModel.findOne({ email: req.body.email });

    if (username) return res.sendStatus(400);
    
    const hash = await bcrypt.hash(req.body.password, 10);
    await UserModel.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      avatar: req.body.gender === "male" ? "/uploads/avatar-man.png" : "/uploads/avatar-woman.png",
      password: hash,
      gender: req.body.gender,
    });
    res.json({ mess: "Successful" });
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
}

const handleLogin = asyncHandler(async (req, res) => {
  try {
    const username = await UserModel.findOne({ email: req.body.email });

    if (username) {
      const result = await bcrypt.compare(req.body.password, username.password);

      if (result) {
        const { _id, email, firstName, lastName, avatar, role, isBan } = username._doc;

        const token = generateToken({ _id });

        res.cookie("tokens", token, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });

        res.json({
          _id,
          firstName,
          lastName,
          email,
          avatar,
          token,
          role,
          isBan,
        });        
      } else {
        res.status(400).json({ message: "Sai mật khẩu" });
      }
    } else {
      res.status(400).json({ message: "Email không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});


const handleChangePassword = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    const { currentPassword, newPassword } = req.body;
    const checkPassword = await bcrypt.compare(currentPassword, username.password);
    if (checkPassword) {
      const hash = await bcrypt.hash(newPassword, 10);
      await UserModel.findByIdAndUpdate(username._id, { password: hash });
      res.json("Correct password");
    } else res.status(400).json("Current password is incorrect!");
  } catch (error) {
    res.status(500).json(error);
  }
});

const handleLogout = asyncHandler((req, res) => {
  try {
    res.clearCookie("tokens");
    res.json({ mess: "Logout Successful" });
  } catch (error) {
    res.status(500).json(error);
  }
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    const resetCode = crypto.randomBytes(3).toString("hex");
    const resetCodeExpires = Date.now() + 3600000;

    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

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

