module.exports = function verifyAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Người dùng chưa được xác thực." });
  }

  if (req.user.role !== 1) {
    return res.status(403).json({ message: "Quyền truy cập bị từ chối. Chỉ dành cho Admin." });
  }

  next();
};
