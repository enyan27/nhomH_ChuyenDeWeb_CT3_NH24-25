const mongoose = require("../config/connectDB");

const UserSchema = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    resetCode: { type: String }, // Mã xác nhận
    resetCodeExpires: { type: Number }, // Thời gian hết hạn mã
    avatar: String,
    coverImg: {
      type: String,
      default: "/uploads/cover-image-default.jpg",
    },
    detailInfo: Object,
    listSaved: [
      {
        type: String,
        ref: "posts",
      },
    ],
    isActive: {
      type: Boolean,
      default: false,
    },
    searchHistory: [String],
    role: {
      type: Number,
      default: 0,
    },
    isBan: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
