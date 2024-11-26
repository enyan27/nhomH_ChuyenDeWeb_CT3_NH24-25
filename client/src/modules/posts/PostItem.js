import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import useToggle from "hooks/useToggle";
import PostContent from "./parts/PostContent";
import PostImage from "./parts/PostImage";
import PostStatus from "./parts/PostStatus";
import PostMeta from "./parts/PostMeta";
import PostSaved from "./parts/PostSaved";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import PostTheme from "./parts/PostTheme";
import CommentFeature from "modules/comments/CommentFeature";
import axios from "api/config";
import Cookies from "js-cookie";
import renderTime from "utils/renderTime";
import MenuNav from "components/menu/MenuNav";
import MenuNavItem from "components/menu/MenuNavItem";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, setModeComment } from "redux/posts/postSlice";
import { Snackbar } from "@mui/material";
import useSnackbarInfo from "hooks/useSnackbarInfo";
import AlertDialog from "components/alert/AlertDialog";
import PostVideo from "./parts/PostVideo";
import RepeatIcon from "@mui/icons-material/Repeat";
import PostAddNew from "./PostAddNew";
import PostItemRetweet from "./PostItemRetweet";

const PostItem = ({ postInfo }) => {
  const navigate = useNavigate(); // Sử dụng useNavigate
  const { currentUser } = useSelector((state) => state.auth.login);
  const {
    _id,
    isLiked,
    saved,
    content,
    theme,
    authorID,
    modeComment,
    commentCount,
    linkVideo,
    type,
    listImg,
    listHeart,
    createdAt,
    retweetPost,
  } = postInfo;

  const { action, handleClose, stateOpen } = useSnackbarInfo();
  const [textAlert, setTextAlert] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [like, setLike] = useToggle(isLiked);
  const [modalComment, setModalComment] = useToggle(false);
  const [countLike, setCountLike] = useState(listHeart.length);
  const [open, setOpen] = stateOpen;
  const [showModal, setShowModal] = useToggle(false);
  const [postType, setPostType] = useState("");
  const [retweetActive, setRetweetActive] = useState(postInfo.isRetweeted);
  const [countRetweet, setCountRetweet] = useState(postInfo.retweetCount);

  const dispatch = useDispatch();

  const handleOpenModalPost = (type = "") => {
    setShowModal(true);
    setPostType(type);
  };

  const handleLiked = async () => {
    try {
      setLike();
      like ? setCountLike((c) => c - 1) : setCountLike((c) => c + 1);
      await axios({
        method: "POST",
        url: "/posts/heart/" + _id,
        headers: {
          authorization: "Bearer " + Cookies.get("tokens"),
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRetweetSuccess = () => {
    setRetweetActive(true);
    setCountRetweet((prev) => prev + 1);
  };

  const handleModeComment = async () => {
    try {
      setTextAlert(modeComment ? "Disabled comment" : "Enabled comment");
      await axios({
        method: "PUT",
        url: "/posts/mode-comment/" + _id,
        headers: {
          authorization: "Bearer " + Cookies.get("tokens"),
        },
      });
      setOpen(true);
      dispatch(setModeComment(_id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    try {
      setTimeout(async () => {
        dispatch(deletePost(_id));
      }, 3000);
      setTextAlert("Post deleted successfully");
      setOpen(true);
      await axios.delete("/posts/" + _id, {
        headers: {
          authorization: "Bearer " + Cookies.get("tokens"),
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Hàm điều hướng, ngừng hành động nếu đang mở modal
  const handleNavigateToDetail = (e) => {
    // Nếu có modal open thì không chuyển trang
    if (e.target.closest(".interactive-btn") || showModal) return;
    navigate(`/post/${_id}`);
  };

  if (type === "retweet") {
    return (
      <PostItemRetweet
        retweetPost={retweetPost}
        originalPost={postInfo}
        onDeletePost={handleDeletePost}
        onToggleComment={handleModeComment}
        onLikePost={handleLiked}
        isLiked={like}
        likeCount={countLike}
      />
    );
  }

  return (
    <>
      <div
        className="flex flex-col border-b border-graySoft dark:border-gray-700 break-all cursor-pointer"
        onClick={handleNavigateToDetail}
      >
        <div className="px-4">
          <div className="flex items-start justify-between mt-5 mb-3">
            <PostMeta timer={renderTime(createdAt)} author={authorID} />
            <div className="flex items-center gap-x-1">
              <PostSaved isSaved={saved} postID={_id} />
              {currentUser?._id === authorID._id && (
                <MenuNav>
                  <MenuNavItem handleExtra={handleModeComment}>
                    {modeComment ? "Disable" : "Enable"} comment
                  </MenuNavItem>
                  <MenuNavItem handleExtra={() => setOpenDialog(true)}>
                    Delete post
                  </MenuNavItem>
                </MenuNav>
              )}
            </div>
          </div>
          {type === "theme" ? (
            <PostTheme theme={theme}>{content}</PostTheme>
          ) : (
            <>
              <PostContent>{content}</PostContent>
              {type === "image" && (
                <PostImage src={listImg[0]} listImg={listImg} />
              )}
              {type === "video" && <PostVideo src={linkVideo} />}
            </>
          )}
          <div className="py-3">
            <div className="flex items-center gap-x-10 justify-between px-16">
              <PostStatus
                className="interactive-btn"
                hoverColor="group-hover:bg-primaryBlue group-hover:text-primaryBlue"
                textColor="group-hover:text-primaryBlue"
                quantity={commentCount}
                title="Comment"
                onClick={setModalComment}
              >
                {modeComment ? (
                  <ChatBubbleOutlineOutlinedIcon className="text-xl" />
                ) : (
                  <CommentsDisabledIcon className="text-xl" />
                )}
              </PostStatus>
              {/* Retweet */}
              {showModal && (
                <PostAddNew
                  handleHideModal={setShowModal}
                  type={postType}
                  postToRetweet={postInfo}
                  onRetweetSuccess={handleRetweetSuccess}
                />
              )}
              <PostStatus
                className="interactive-btn"
                hoverColor="group-hover:bg-retweetColor group-hover:text-retweetColor"
                textColor={retweetActive ? "text-retweetColor" : ""}
                quantity={countRetweet}
                title={retweetActive ? "You've been retweeted" : "Retweet"}
                onClick={!retweetActive ? () => handleOpenModalPost("retweet") : undefined}
              >
                <RepeatIcon className="text-xl" />
              </PostStatus>
              <PostStatus
                className="interactive-btn"
                hoverColor="group-hover:bg-heartColor group-hover:text-heartColor"
                textColor={like ? "text-heartColor" : ""}
                quantity={countLike}
                title={like ? "Unlike" : "Like"}
                onClick={handleLiked}
              >
                {like ? (
                  <FavoriteIcon className="text-xl text-heartColor" />
                ) : (
                  <FavoriteBorderIcon className="text-xl" />
                )}
              </PostStatus>
            </div>
          </div>
        </div>
      </div>
      {modalComment && (
        <CommentFeature
          modalComment={modalComment}
          handleHideModal={setModalComment}
          post={postInfo}
        />
      )}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={textAlert}
        action={action}
      />
      <AlertDialog
        open={openDialog}
        setOpen={setOpenDialog}
        handleExtra={handleDeletePost}
        textConfirm="You want to delete this post?"
        textSupport="This post will be permanently lost if you confirm"
      />
    </>
  );
};

export default PostItem;
