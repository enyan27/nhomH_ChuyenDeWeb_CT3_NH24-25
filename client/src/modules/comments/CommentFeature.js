import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import Overlay from "components/common/Overlay";
import ModalHeading from "components/modal/ModalHeading";
import PostMeta from "modules/posts/parts/PostMeta";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import ModalLine from "components/modal/ModalLine";
import CommentItem from "./CommentItem";
import { socket } from "api/config";
import { getCommentList } from "redux/comments/commentRequest";
import { deleteComment, newComment, updateReplies } from "redux/comments/commentSlice";
import CommentSkeleton from "components/skeleton/CommentSkeleton";
import LoadingType from "components/loading/LoadingType";
import { Link } from "react-router-dom";
import EmptyLayout from "layout/EmptyLayout";
import renderTime from "utils/renderTime";

const CommentFeature = ({ handleHideModal, post }) => {
  const { _id, authorID, createdAt } = post;
  const { currentUser } = useSelector((state) => state.auth.login);
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useDispatch();

  const { listComment, loading } = useSelector(
    (state) => state.comments.getComment
  );

  // Emit typing events
  const emitTyping = useCallback(() => {
    socket.emit("typing");
  }, []);

  const emitStopTyping = useCallback(() => {
    socket.emit("stopTyping");
  }, []);

  // Fetch initial comments and join socket room
  useEffect(() => {
    dispatch(getCommentList(_id));
    socket.connect();
    socket.emit("join", { user: currentUser._id, post: _id });

    return () => {
      socket.emit("remove-event-comment");
      socket.disconnect();
    };
  }, [dispatch, _id, currentUser._id]);

  // Handle typing events
  useEffect(() => {
    const handleTyping = () => setIsTyping(true);
    const handleStopTyping = () => setIsTyping(false);

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, []);

  // Handle new comments and updates
  useEffect(() => {
    const handleNewComment = (comment) => dispatch(newComment(comment));
    const handleReplyAdded = ({ commentId, replies }) =>
      dispatch(updateReplies({ commentId, replies }));
    const handleCommentDeleted = (commentId) => dispatch(deleteComment(commentId));

    socket.on("comment", handleNewComment);
    socket.on("replyAdded", handleReplyAdded);
    socket.on("deletedComment", handleCommentDeleted);

    return () => {
      socket.off("comment", handleNewComment);
      socket.off("replyAdded", handleReplyAdded);
      socket.off("deletedComment", handleCommentDeleted);
    };
  }, [dispatch]);

  // Handle reply deleted
  useEffect(() => {
    const handleReplyDeleted = ({ commentId, replyId }) => {
      const comment = listComment.find((c) => c._id === commentId);
      if (comment) {
        const updatedReplies = comment.replies.filter((reply) => reply._id !== replyId);
        dispatch(updateReplies({ commentId, replies: updatedReplies }));
      }
    };

    socket.on("replyDeleted", handleReplyDeleted);

    return () => {
      socket.off("replyDeleted", handleReplyDeleted);
    };
  }, [dispatch, listComment]);

  return (
    <Overlay handleHideModal={handleHideModal}>
      <div className="w-[600px] mx-auto bg-white dark:bg-darkSoft z-50 rounded-xl show-modal ">
        <ModalHeading handleHideModal={handleHideModal}>
          Post comments
        </ModalHeading>
        <ModalLine />
        <div className="flex flex-col px-5 py-4 max-h-[80vh] overflow-auto">
          <PostMeta
            timer={renderTime(createdAt)}
            sizeAvatar={52}
            author={authorID}
          ></PostMeta>
          <div className="px-[26px] my-2 flex items-center">
            <div className="h-[45px] w-[2px] bg-[#ddd]"></div>
            <p className="ml-5 text-sm text-text3 dark:text-text4">
              Replying to <b className="text-thirdColor">{authorID.lastName}</b>
            </p>
          </div>
          <div className="flex items-start gap-x-3">
            <Link to={"/profile/" + currentUser._id}>
              <Avatar
                alt={currentUser.firstName + " " + currentUser.lastName}
                src={currentUser.avatar}
                sx={{ width: 52, height: 52 }}
              />
            </Link>
            <CommentForm
              postID={_id}
              isTyping={isTyping}
              emitTyping={emitTyping}
              emitStopTyping={emitStopTyping}
            ></CommentForm>
          </div>
          <CommentList>
            {loading && (
              <>
                <CommentSkeleton></CommentSkeleton>
                <CommentSkeleton></CommentSkeleton>
              </>
            )}
            {!loading && listComment?.length > 0 ? (
              listComment.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  isAuthor={authorID._id === comment?.userID._id}
                />
              ))
            ) : (
              <EmptyLayout
                linkImg="/img/no-comment.png"
                info="No comment yet"
                support="Let's become to first person comment this post"
                className="py-3"
              ></EmptyLayout>
            )}
            {isTyping ? (
              <LoadingType message="Someone is typing a comment" />
            ) : null}
          </CommentList>
        </div>
      </div>
    </Overlay>
  );
};

export default CommentFeature;
