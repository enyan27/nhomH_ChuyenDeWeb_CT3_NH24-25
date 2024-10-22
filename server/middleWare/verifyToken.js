const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

module.exports = function verifyToken(req, res, next) {
  const headerAuth = req.headers.authorization;
  const token = headerAuth.split("Bearer ")[1];
  if (!token) res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) res.status(403).json("Token is not valid");
    else {
      req.username = await UserModel.findById(data._id);
      next();
    }
  });
};
