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
import RepeatIcon from '@mui/icons-material/Repeat';
import PostTheme from "./parts/PostTheme";
import CommentFeature from "modules/comments/CommentFeature";
import axios from "api/config";
import Cookies from "js-cookie";
import renderTime from "utils/renderTime";
import { Menu, MenuItem, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Button, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, setModeComment } from "redux/posts/postSlice";
import useSnackbarInfo from "hooks/useSnackbarInfo";
import AlertDialog from "components/alert/AlertDialog";
import PostVideo from "./parts/PostVideo";


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
  } = postInfo;

  const { action, handleClose, stateOpen } = useSnackbarInfo();
  const [textAlert, setTextAlert] = useState("");
  const [like, setLike] = useToggle(isLiked);
  const [openDialog, setOpenDialog] = useState(false);
  const [modalComment, setModalComment] = useToggle(false);
  const [countLike, setCountLike] = useState(listHeart.length);
  const [open, setOpen] = stateOpen;
  const [anchorEl, setAnchorEl] = useState(null);
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reason, setReason] = useState(""); // State to store the selected reason
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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
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

  const handleReportPost = () => {
    setOpenReportDialog(true);
  };

  const confirmReportPost = async () => {
    try {
      // Gọi API để report bài viết với lý do đã chọn
      await axios({
        method: "POST",
        url: "/posts/report/" + _id,
        headers: {
          authorization: "Bearer " + Cookies.get("tokens"),
        },
        data: {
          reason
        }
      });
      // Hiển thị thông báo thành công
      setTextAlert("Post reported successfully");
      setOpen(true); // Mở Snackbar để thông báo
      setOpenReportDialog(false); // Đóng dialog
    } catch (error) {
      console.log(error);
      // Xử lý lỗi và hiển thị thông báo
      setTextAlert("Failed to report post");
      setOpen(true);
    }
  };

  return (
    <>
      <div className="flex flex-col border-b-2 border-graySoft dark:border-gray-700">
        <div className="flex items-start justify-between mt-5 mb-3">
          <PostMeta timer={renderTime(createdAt)} author={authorID} />
          <div className="flex items-center gap-x-1">
            <PostSaved isSaved={saved} postID={_id} />
            <MoreVertIcon onClick={handleMenuClick} style={{ cursor: "pointer" }} />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleModeComment}>
                {modeComment ? "Disable Comment" : "Enable Comment"}
              </MenuItem>
              <MenuItem onClick={() => setOpenDialog(true)}>Delete Post</MenuItem>
              <MenuItem onClick={handleReportPost}>Report Post</MenuItem>
            </Menu>
          </div>
        </div>

        {type === "theme" ? (
          <PostTheme theme={theme}>{content}</PostTheme>
        ) : (
          <>
            <PostContent>{content}</PostContent>
            {type === "image" ? (
              <PostImage src={listImg[0]} listImg={listImg} />
            ) : (
              <PostVideo src={linkVideo} />
            )}
          </>
        )}

        <div className="py-3">
          <div className="flex items-center gap-x-10 justify-between px-16">
            <PostStatus
              hoverColor="group-hover:bg-thirdColor group-hover:heartColor"
              textColor="group-hover:text-heartColor"
              quantity={commentCount}
              className={!modeComment ? "pointer-events-none opacity-60" : ""}
              title="Comment"
              onClick={setModalComment}
            >
              {modeComment ? (
                <ChatBubbleOutlineOutlinedIcon className="text-xl" />
              ) : (
                <CommentsDisabledIcon className="text-xl" />
              )}
            </PostStatus>

            <PostStatus
              hoverColor=""
              quantity={0}
              textColor="text-gray-500"
              title="Repeat Icon"
              className="cursor-not-allowed"
            >
              <RepeatIcon className="text-xl text-gray-500" />
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
                <FavoriteIcon className="text-xl text-heartColor heart-active" />
              ) : (
                <FavoriteBorderIcon className="text-xl heart-active" />
              )}
            </PostStatus>
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

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message={textAlert} action={action} />

      <AlertDialog
        open={openDialog}
        setOpen={setOpenDialog}
        handleExtra={handleDeletePost}
        textConfirm="You want to delete this post?"
        textSupport="This post will be permanently lost if you confirm"
      />

      <Dialog open={openReportDialog} onClose={() => setOpenReportDialog(false)}>
        <DialogTitle>Report Post</DialogTitle>
        <DialogContent>
          <RadioGroup value={reason} onChange={(e) => setReason(e.target.value)}>
            <FormControlLabel value="Spam" control={<Radio />} label="Spam" />
            <FormControlLabel value="Harassment" control={<Radio />} label="Harassment" />
            <FormControlLabel value="Misinformation" control={<Radio />} label="Misinformation" />
            <FormControlLabel value="Other" control={<Radio />} label="Other" />
          </RadioGroup>
        </DialogContent>
                <DialogActions>
          <Button onClick={() => setOpenReportDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmReportPost} color="primary">
            Report
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostItem;

          