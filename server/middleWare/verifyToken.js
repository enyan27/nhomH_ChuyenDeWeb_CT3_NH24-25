const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

module.exports = function verifyToken(req, res, next) {
  const headerAuth = req.headers.authorization;
  if (!headerAuth) return res.sendStatus(401);  // Kiểm tra nếu không có header Authorization
  
  const token = headerAuth.split("Bearer ")[1];
  if (!token) return res.status(401).json("Token is missing or malformed.");

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid", error: err.message });
    }
    
    // Lưu thông tin người dùng vào req để sử dụng sau
    req.username = await UserModel.findById(data._id);
    if (!req.username) return res.status(404).json("User not found.");
    
    next();  // Cho phép truy cập tiếp nếu token hợp lệ và người dùng tồn tại
  });
};
