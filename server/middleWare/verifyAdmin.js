module.exports = function verifyAdmin(req, res, next) {
  if (req.user.role !== 1) {
    return res.status(403).json("Access denied. Admins only.");
  }
  next();
};