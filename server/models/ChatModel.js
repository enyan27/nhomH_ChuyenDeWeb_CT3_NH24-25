const mongoose = require("../config/connectDB");

const ChatSchema = mongoose.Schema(
  {
    participant: [
      {
        type: String,
        ref: "users",
      },
    ],
    latestMessage: {
      type: String,
      ref: "messages",
    },
    show: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("chats", ChatSchema);
