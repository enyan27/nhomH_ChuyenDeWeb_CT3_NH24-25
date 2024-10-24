// routes/authRoutes.js
const router = require("express").Router();
const {
  handleRegister,
  handleLogin,
  handleLogout,
  handleChangePassword,
  sendResetEmail,
  verifyResetCode,
  resetPassword,
} = require("../controllers/authController");
const verifyToken = require("../middleWare/verifyToken");

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.put("/change-password", verifyToken, handleChangePassword);

// Thêm các route cho quên mật khẩu
router.post("/send-reset-email", sendResetEmail);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

module.exports = router;
