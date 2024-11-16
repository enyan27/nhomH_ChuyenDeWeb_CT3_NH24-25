const router = require("express").Router();
const {
  getCommentByPostID,
  handleAddComments,
  handleAddReply
} = require("../controllers/commentController");
const verifyToken = require("../middleWare/verifyToken");

router.get("/:id", verifyToken, getCommentByPostID);

router.post("/public/:id", verifyToken, handleAddComments);

// API - Reply
router.post("/:id/replies/:commentId", verifyToken, handleAddReply);

module.exports = router;
