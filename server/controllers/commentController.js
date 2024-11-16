const asyncHandler = require("express-async-handler");
const CommentModel = require("../models/CommentModel");
const PostModel = require("../models/PostModel");

const getCommentByPostID = asyncHandler(async (req, res) => {
  try {
    const listComment = await CommentModel.find({
      postID: req.params.id,
    })
      .populate("userID", ["_id", "firstName", "lastName", "avatar"])
      .populate({
        path: "replies.userID",
        select: ["_id", "firstName", "lastName", "avatar"],
      });

    res.json({ listComment });
  } catch (error) {
    res.status(500).json("Server error");
  }
});


const handleAddComments = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    if (!req.body) res.status(400).json("Please type full info");
    if (!req.body.content || req.body.content.trim().length == 0) {
      return res.status(400).json("Comment must have 1 character at least");
    }
    const { modeComment, authorID } = await PostModel.findById(req.params.id);
    if (!modeComment) res.status(400).json("Mode comment is turned off");
    else {
      const { _id } = await CommentModel.create({
        ...req.body,
        userID: username._id,
        postID: req.params.id,
      });
      const newComment = await CommentModel.findById(_id).populate("userID");
      res.json({ ...newComment._doc, authorID });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// API - Reply
const handleAddReply = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;
  const username = req.username;

  try {
    if (!content || content.trim().length === 0) {
      return res.status(400).json("Reply must have 1 character at least");
    }

    const comment = await CommentModel.findById(commentId);
    if (!comment) return res.status(404).json("Comment not found");

    const reply = {
      content,
      userID: username._id,
    };

    comment.replies.push(reply);
    await comment.save();

    const populatedReply = await CommentModel.findById(commentId)
      .select("replies")
      .populate("replies.userID", ["_id", "firstName", "lastName", "avatar"]);

    res.status(201).json(populatedReply.replies);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = { getCommentByPostID, handleAddComments, handleAddReply };
