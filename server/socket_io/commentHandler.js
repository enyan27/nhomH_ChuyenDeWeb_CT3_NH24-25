const { getCurrentUser, userJoin, removeUser } = require("../utils/usersJoin");
const { formatComment } = require("../utils/formatComment");
const CommentModel = require("../models/CommentModel");
const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");

module.exports = function commentHandler(socket, io) {
  socket.on("join", ({ user, post }) => {
    const newUser = userJoin(socket.id, user, post);
    socket.join(newUser.post);
  });

  socket.on("typing", () => {
    const currentUser = getCurrentUser(socket.id)[0];
    if (!currentUser) {
      return socket.emit("error", "Server error");
    }

    socket.broadcast.to(currentUser.post).emit("typing");
  });

  socket.on("stopTyping", () => {
    const currentUser = getCurrentUser(socket.id)[0];

    if (!currentUser) {
      return socket.emit("error", "Server error");
    }

    socket.broadcast.to(currentUser.post).emit("stopTyping");
  });

  socket.on("sendComment", async (comment) => {
    const currentUser = getCurrentUser(socket.id)[0];
    try {
      if (!currentUser) socket.emit("error", "Invalid user");
      io.to(currentUser.post).emit("comment", comment);
    } catch (err) {
      socket.emit("error", err);
    }
  });

  socket.on("deleteComment", async (commentId) => {
    const currentUser = getCurrentUser(socket.id)[0];
    try {
      const deleteComment = await CommentModel.findById(commentId);
      if (!deleteComment && currentUser.user !== deleteComment.userID) {
        return socket.emit("error", "Authorization");
      }
      await CommentModel.findByIdAndDelete(commentId);
      io.to(currentUser.post).emit("deletedComment", commentId);
    } catch (err) {
      console.log("DELETE COMMENT ERROR:", err);
      socket.emit("error", err);
    }
  });

  socket.on("remove-event-comment", () => {
    removeUser(socket.id);
  });

  // API - Add Reply
  socket.on("sendReply", async ({ commentId, reply }) => {
    const currentUser = getCurrentUser(socket.id)[0];
  
    try {
      if (!currentUser) return socket.emit("error", "Invalid user");
  
      const comment = await CommentModel.findById(commentId);
      if (!comment) return socket.emit("error", "Comment not found");
  
      const newReply = {
        content: reply.content,
        userID: currentUser.user,
      };
  
      comment.replies.push(newReply);
      await comment.save();
  
      const populatedComment = await CommentModel.findById(commentId).populate(
        "replies.userID",
        ["_id", "firstName", "lastName", "avatar"]
      );
  
      io.to(currentUser.post).emit("replyAdded", {
        commentId,
        replies: populatedComment.replies,
      });
    } catch (err) {
      socket.emit("error", err.message);
    }
  });
  
  // API - Destroy Reply
  socket.on("deleteReply", async ({ commentId, replyId }) => {
    const currentUser = getCurrentUser(socket.id)[0];
  
    try {
      if (!currentUser) return socket.emit("error", "Invalid user");
  
      const comment = await CommentModel.findById(commentId);
      if (!comment) return socket.emit("error", "Comment not found");
  
      const replyIndex = comment.replies.findIndex(
        (r) => r._id.toString() === replyId
      );
      if (replyIndex === -1) return socket.emit("error", "Reply not found");
  
      if (comment.replies[replyIndex].userID.toString() !== currentUser.user) {
        return socket.emit("error", "Unauthorized");
      }
  
      comment.replies.splice(replyIndex, 1);
      await comment.save();
  
      io.to(currentUser.post).emit("replyDeleted", { commentId, replyId });
    } catch (err) {
      socket.emit("error", err.message);
    }
  });
};
