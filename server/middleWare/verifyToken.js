const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

module.exports = function verifyToken(req, res, next) {
  const headerAuth = req.headers.authorization;

  if (!headerAuth) return res.sendStatus(401);

  const token = headerAuth.split("Bearer ")[1];
  if (!token) return res.status(401).json("Token is missing or malformed.");

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      console.error("Lỗi xác minh token:", err);
      return res.status(403).json({ message: "Token is not valid", error: err.message });
    }
    req.username = await UserModel.findById(data._id);

    if (!req.username) return res.status(404).json("User not found.");

    next();
  });
};
