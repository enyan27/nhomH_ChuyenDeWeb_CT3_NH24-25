import React, { useState } from "react";
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
import RepeatIcon from '@mui/icons-material/Repeat';
import PostAddNew from './PostAddNew';
import PostItemRetweet from './PostItemRetweet';

const PostItem = ({ postInfo }) => {
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

  const handleOpenModalPost = (type = "") => {
    setShowModal(true);
    setPostType(type);
  };

  const dispatch = useDispatch();

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

  if (type === "retweet") {
    return (
      <PostItemRetweet
        retweetPost={retweetPost}
        originalPost={postInfo}
        onDeletePost={() => handleDeletePost()}
        onToggleComment={() => handleModeComment()}
        onLikePost={() => handleLiked()}
        isLiked={like}
        likeCount={countLike}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col border-b border-graySoft dark:border-gray-700">
        <div className="px-4">
          <div className="flex items-start justify-between mt-5 mb-3">
            <PostMeta timer={renderTime(createdAt)} author={authorID}></PostMeta>
            <div className="flex items-center gap-x-1">
              <PostSaved isSaved={saved} postID={_id}></PostSaved>
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
                <PostImage src={listImg[0]} listImg={listImg}></PostImage>
              )}
              {type === "video" && <PostVideo src={linkVideo}></PostVideo>}
            </>
          )}
          {/* Nút trạng thái bài viết bình thường */}
          <div className="py-3 ">
            <div className="flex items-center gap-x-10 justify-between px-16">
              <PostStatus
                hoverColor="group-hover:bg-primaryBlue group-hover:text-primaryBlue"
                textColor="group-hover:text-primaryBlue"
                quantity={commentCount}
                className={!modeComment ? "pointer-events-none opacity-60" : ""}
                title="Comment"
                onClick={setModalComment}
              >
                {modeComment ? (
                  <ChatBubbleOutlineOutlinedIcon className="text-xl"></ChatBubbleOutlineOutlinedIcon>
                ) : (
                  <CommentsDisabledIcon className="text-xl"></CommentsDisabledIcon>
                )}
              </PostStatus>
              {/* Retweet */}
              {showModal && (
                <PostAddNew
                  handleHideModal={setShowModal}
                  type={postType}
                  postToRetweet={postInfo}
                  onRetweetSuccess={handleRetweetSuccess}
                ></PostAddNew>
              )}

              <PostStatus
                hoverColor="group-hover:bg-retweetColor group-hover:text-retweetColor"
                textColor={retweetActive ? "text-retweetColor" : "group-hover:text-retweetColor"}
                quantity={countRetweet}
                title={retweetActive ? "You've been retweeted" : "Retweet"}
                onClick={!retweetActive ? () => handleOpenModalPost("retweet") : undefined}
                className={retweetActive ? "cursor-not-allowed" : ""}
              >
                <RepeatIcon className={`text-xl ${retweetActive ? "text-retweetColor" : ""}`}></RepeatIcon>
              </PostStatus>

              <PostStatus
                hoverColor="group-hover:bg-heartColor group-hover:text-heartColor"
                quantity={countLike}
                textColor={
                  like
                    ? "text-heartColor"
                    : "group-hover:text-heartColor transition-colors"
                }
                onClick={handleLiked}
                title={like ? "Unlike" : "Like"}
              >
                {like ? (
                  <FavoriteIcon className="text-xl text-heartColor heart-active"></FavoriteIcon>
                ) : (
                  <FavoriteBorderIcon className="text-xl heart-active"></FavoriteBorderIcon>
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
        ></CommentFeature>
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
      ></AlertDialog>
    </>
  );
};

export default PostItem;
