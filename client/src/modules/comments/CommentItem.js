import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { socket } from "api/config";
import { Avatar, Tooltip } from "@mui/material";
import { Button, CircularProgress, TextareaAutosize } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedIcon from "@mui/icons-material/Verified";
import TextUsername from "components/text/TextUsername";
import AlertDialog from "components/alert/AlertDialog";
import renderTime from "utils/renderTime";
import parse from "html-react-parser";

const CommentItem = ({ comment, isAuthor = false }) => {
  const { currentUser } = useSelector((state) => state.auth.login);
  const { content, userID, createdAt, replies = [], updatedAt: commentUpdatedAt } = comment;

  const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = useState(false);
  const [openDeleteReplyDialog, setOpenDeleteReplyDialog] = useState(null);
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [updatedAt, setUpdatedAt] = useState(commentUpdatedAt || null);

  const fullName = userID?.firstName + " " + userID?.lastName;

  const handleDeleteComment = () => {
    socket.emit("deleteComment", comment._id);
    setOpenDeleteCommentDialog(false);
  };

  const handleDeleteReply = (replyId) => {
    socket.emit("deleteReply", { replyId, commentId: comment._id });
    setOpenDeleteReplyDialog(null);
  };

  const handleEditComment = () => {
    if (!editContent.trim()) return;
    const currentTime = new Date().toISOString();
    socket.emit("editComment", { commentId: comment._id, content: editContent });
    setUpdatedAt(currentTime);
    setIsEditing(false);
  };

  const handleAddReply = () => {
    if (replyContent.trim()) {
      socket.emit("sendReply", { commentId: comment._id, reply: { content: replyContent } });
      setReplyContent("");
    }
  };
  const handleCancelEdit = () => {
    setEditContent(content); // Quay về nội dung gốc của bình luận
    setIsEditing(false); // Đóng chế độ chỉnh sửa
  };


  useEffect(() => {
    socket.on("commentUpdated", ({ commentId, content, updatedAt }) => {
      if (commentId === comment._id) {
        setEditContent(content);
        setUpdatedAt(updatedAt);
      }
    });

    socket.on("replyDeleted", (replyId) => {
      // Xử lý khi reply bị xóa
      // Cập nhật lại danh sách replies nếu cần
    });

    return () => {
      socket.off("commentUpdated");
      socket.off("replyDeleted");
    };
  }, [comment._id]);

  return (
    <>
      {/* Main Comment */}
      <div className="flex items-start gap-x-3">
        <Link to={"/profile/" + userID?._id}>
          <Avatar src={userID?.avatar} alt={fullName} sx={{ width: 52, height: 52 }} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-x-1">
            <TextUsername>{fullName}</TextUsername>
            {isAuthor && <VerifiedIcon className="text-xl text-primary" titleAccess="Author" />}
            <p className="text-[13px] font-normal text-text4 ml-1">{renderTime(createdAt)}</p>
            {updatedAt && updatedAt !== createdAt && (
              <span className="text-[12px] text-gray-500 ml-2">(Đã chỉnh sửa)</span>
            )}
          </div>

          <div className="flex items-center justify-between mt-1">
            {isEditing ? (
              <div className="flex items-center gap-x-3">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  maxLength={150} // Giới hạn 150 ký tự
                  className="flex-1 px-4 py-2 transition-all bg-transparent border text-text2 dark:text-white rounded-xl border-strock dark:border-gray-600 focus:border-primary"
                />
                <div className="text-sm text-gray-500">
                  {editContent.length}/150
                </div>
                <Button
                  onClick={handleEditComment}
                  variant="contained"
                  disabled={!editContent.trim() || editContent === content} // Chặn khi nội dung không hợp lệ hoặc không thay đổi
                  className={`w-[80px] h-[32px] bg-primary text-white font-medium rounded-[20px] py-[4px] px-3 text-xs transition-all ${!editContent.trim() || editContent === content ? "opacity-30 cursor-not-allowed" : ""
                    }`}
                >
                  Save
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outlined"
                  className="w-[80px] h-[32px] border-gray-400 text-gray-600 font-medium rounded-[20px] py-[4px] px-3 text-xs hover:bg-gray-100 transition-all"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <h5 className="text-[15px] font-normal text-text2 dark:text-whiteSoft break-all">
                {parse(editContent)}
              </h5>
            )}
            {!isEditing && userID?._id === currentUser?._id && (
              <div className="flex items-center gap-x-2">
                <Tooltip onClick={() => setIsEditing(true)}>
                  <EditIcon className="text-xl text-iconColor" titleAccess="Edit comment" />
                </Tooltip>
                <Tooltip onClick={() => setOpenDeleteCommentDialog(true)}>
                  <DeleteIcon className="text-xl text-iconColor" titleAccess="Delete comment" />
                </Tooltip>
              </div>
            )}
          </div>
          <button
            className="text-blue-500 text-sm mt-1"
            onClick={() => setShowReplies((prev) => !prev)}
          >
            {showReplies ? "Hide replies" : `View replies (${replies.length})`}
          </button>
        </div>
      </div>

      {/* Replies Section */}
      {showReplies && (
        <div className="ml-10 mt-2">
          {replies.length > 0 ? (
            replies.map((reply) => (
              <div key={reply._id} className="flex items-start gap-x-3 mb-3">
                <Link to={"/profile/" + reply.userID?._id}>
                  <Avatar
                    src={reply.userID?.avatar}
                    alt={`${reply.userID?.firstName} ${reply.userID?.lastName}`}
                    sx={{ width: 40, height: 40 }}
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex items-center gap-x-1">
                    <TextUsername>{`${reply.userID?.firstName} ${reply.userID?.lastName}`}</TextUsername>
                    <p className="text-[13px] font-normal text-text4 ml-1">{renderTime(reply.createdAt)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm break-all">{reply.content}</p>
                    {reply.userID?._id === currentUser?._id && (
                      <Tooltip
                        className="cursor-pointer opacity-80"
                        onClick={() => setOpenDeleteReplyDialog(reply._id)}
                      >
                        <DeleteIcon
                          className="text-xl text-iconColor"
                          titleAccess="Delete reply"
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No replies yet</p>
          )}
          <div className="flex items-center gap-x-3 mt-3">
            <Link to={"/profile/" + currentUser?._id}>
              <Avatar
                src={currentUser.avatar}
                alt={`${currentUser.firstName} ${currentUser.lastName}`}
                sx={{ width: 40, height: 40 }}
              />
            </Link>
            <TextareaAutosize
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply"
              minRows={1}
              className="flex-1 px-4 py-3 transition-all bg-transparent border text-text2 dark:text-white rounded-xl border-strock dark:border-gray-600 focus:border-primary resize-none"
            />
            <Button
              onClick={handleAddReply}
              variant="contained"
              disabled={!replyContent.trim()}
              className={`w-[100px] bg-primary text-white font-semibold rounded-full py-[6px] transition-all ${!replyContent.trim() ? "opacity-30 cursor-not-allowed" : ""}`}
            >
              Reply
            </Button>
          </div>
        </div>
      )}

      {/* Delete Comment Confirmation */}
      <AlertDialog
        open={openDeleteCommentDialog}
        setOpen={setOpenDeleteCommentDialog}
        handleExtra={handleDeleteComment}
        textConfirm="You want to delete this comment?"
        textSupport="This comment will be removed from post"
      />

      {/* Delete Reply Confirmation */}
      <AlertDialog
        open={!!openDeleteReplyDialog}
        setOpen={setOpenDeleteReplyDialog}
        handleExtra={() => handleDeleteReply(openDeleteReplyDialog)}
        textConfirm="You want to delete this reply?"
        textSupport="This reply will be removed from the comment"
      />
    </>
  );
};

export default CommentItem;
