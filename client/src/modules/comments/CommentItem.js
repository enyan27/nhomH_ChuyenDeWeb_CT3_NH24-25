import React, { useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "api/config";
import { Avatar, Tooltip } from "@mui/material";
import TextUsername from "components/text/TextUsername";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import VerifiedIcon from "@mui/icons-material/Verified";
import AlertDialog from "components/alert/AlertDialog";
import renderTime from "utils/renderTime";
import parse from "html-react-parser";

const CommentItem = ({ comment, isAuthor = false }) => {
  const { currentUser } = useSelector((state) => state.auth.login);
  const { content, userID, createdAt, replies = [] } = comment;
  const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = useState(false);
  const [openDeleteReplyDialog, setOpenDeleteReplyDialog] = useState(null);
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const fullName = userID?.firstName + " " + userID?.lastName;

  const handleDeleteComment = () => {
    socket.emit("deleteComment", comment._id);
    setOpenDeleteCommentDialog(false);
  };

  const handleAddReply = () => {
    if (replyContent.trim()) {
      socket.emit("sendReply", { commentId: comment._id, reply: { content: replyContent } });
      setReplyContent("");
    }
  };

  const handleDeleteReply = () => {
    if (openDeleteReplyDialog) {
      socket.emit("deleteReply", { commentId: comment._id, replyId: openDeleteReplyDialog });
      setOpenDeleteReplyDialog(null);
    }
  };

  return (
    <>
      {/* Main Comment */}
      <div className="flex items-start gap-x-3">
        <Link to={"/profile/" + userID?._id}>
          <Avatar
            src={userID?.avatar}
            alt={fullName}
            sx={{ width: 52, height: 52 }}
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-x-1">
            <TextUsername>{fullName}</TextUsername>
            {isAuthor && (
              <VerifiedIcon
                className="text-xl text-primary"
                titleAccess="Author"
              />
            )}
            <p className="text-[13px] font-normal text-text4 ml-1">
              {renderTime(createdAt)}
            </p>
          </div>

          <div className="flex items-center justify-between mt-1">
            <h5 className="text-[15px] font-normal text-text2 dark:text-whiteSoft">
              {parse(content)}
            </h5>
            {userID?._id === currentUser?._id && (
              <Tooltip
                className="cursor-pointer opacity-80"
                onClick={() => setOpenDeleteCommentDialog(true)}
              >
                <DeleteIcon
                  className="text-xl text-iconColor"
                  titleAccess="Delete comment"
                />
              </Tooltip>
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
                    {reply.userID?._id === currentUser?._id && (
                      <VerifiedIcon
                        className="text-xl text-primary"
                        titleAccess="Author"
                      />
                    )}
                    <p className="text-[13px] font-normal text-text4 ml-1">
                      {renderTime(reply.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm">{reply.content}</p>
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
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            />
            <button
              onClick={handleAddReply}
              className="text-blue-500 font-medium"
            >
              Reply
            </button>
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
      ></AlertDialog>

      {/* Delete Reply Confirmation */}
      <AlertDialog
        open={!!openDeleteReplyDialog}
        setOpen={setOpenDeleteReplyDialog}
        handleExtra={handleDeleteReply}
        textConfirm="You want to delete this reply?"
        textSupport="This reply will be removed from this comment"
      ></AlertDialog>
    </>
  );
};

export default CommentItem;
