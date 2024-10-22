const UserModel = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleRegister = asyncHandler(async (req, res) => {
  try {
    const username = await UserModel.findOne({
      email: req.body.email,
    });

    if (username) res.sendStatus(400);
    else {
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
      res.json({ mess: "Successful" });
    }
  } catch (error) {
    res.sendStatus(500);
    throw new Error(error);
  }
});

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

const handleLogin = asyncHandler(async (req, res) => {
  try {
    const username = await UserModel.findOne({
      email: req.body.email,
    });

    if (username) {
      const result = await bcrypt.compare(req.body.password, username.password);
      if (result) {
        const { _id, email, firstName, lastName, avatar } = username._doc;
        const token = generateToken({ _id });
        res.cookie("tokens", token, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });

        res.json({ _id, firstName, lastName, email, avatar, token });
      } else res.sendStatus(400);
    } else res.sendStatus(400);
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

const handleChangePassword = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    const { currentPassword, newPassword } = req.body;
    const checkPassword = await bcrypt.compare(
      currentPassword,
      username.password
    );
    if (checkPassword) {
      const hash = await bcrypt.hash(newPassword, 10);
      await UserModel.findByIdAndUpdate(username._id, {
        password: hash,
      });
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

module.exports = {
  handleRegister,
  handleLogin,
  handleLogout,
  handleChangePassword,
};
