import React, { useState } from "react";
import PostMeta from "./parts/PostMeta";
import PostContent from "./parts/PostContent";
import PostImage from "./parts/PostImage";
import PostVideo from "./parts/PostVideo";
import PostTheme from "./parts/PostTheme";
import PostStatus from "./parts/PostStatus";
import { useSelector } from "react-redux";
import MenuNav from "components/menu/MenuNav";
import MenuNavItem from "components/menu/MenuNavItem";
import PostSaved from "./parts/PostSaved";
import renderTime from "utils/renderTime";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentFeature from "modules/comments/CommentFeature";
import AlertDialog from "components/alert/AlertDialog";
import { Snackbar } from "@mui/material";
import useSnackbarInfo from "hooks/useSnackbarInfo";

const PostItemRetweet = ({
    retweetPost,
    originalPost,
    onDeletePost,
    onToggleComment,
    onLikePost,
    isLiked,
    likeCount,
}) => {
    const { currentUser } = useSelector((state) => state.auth.login);
    const [modalComment, setModalComment] = useState(false);
    const { action, handleClose, stateOpen } = useSnackbarInfo();
    const [openDialog, setOpenDialog] = useState(false);
    const [open, setOpen] = stateOpen;
    const [textAlert, setTextAlert] = useState("");

    const handleDeleteConfirm = () => {
        setOpenDialog(false);
        setTextAlert("Post deleted successfully");
        setOpen(true);
        onDeletePost();
    };

    return (
        <div className="flex flex-col border-b border-graySoft dark:border-gray-700 break-all">
            {/* Header */}
            <div className="px-12 pt-1">
                <RepeatIcon className="text-xl text-text4 mr-0.5"></RepeatIcon>
                <span className={`text-[13px] text-text4 font-semibold`}>
                    {originalPost.authorID.firstName + " " + originalPost.authorID.lastName} reposted
                </span>
            </div>
            {/* Main Content */}
            <div className="px-4">
                <div className="flex items-start justify-between mt-1">
                    <PostMeta
                        timer={renderTime(originalPost.createdAt)}
                        author={originalPost.authorID}
                    ></PostMeta>
                    <div className="flex items-center gap-x-1">
                        <PostSaved isSaved={originalPost.saved} postID={originalPost._id}></PostSaved>
                        {currentUser?._id === originalPost.authorID._id && (
                            <MenuNav>
                                <MenuNavItem handleExtra={onToggleComment}>
                                    {originalPost.modeComment ? "Disable" : "Enable"} comment
                                </MenuNavItem>
                                <MenuNavItem handleExtra={() => setOpenDialog(true)}>
                                    Delete post
                                </MenuNavItem>
                            </MenuNav>
                        )}
                    </div>
                </div>
                <div className="mt-3 ml-8">
                    {originalPost.type === "theme" ? (
                        <PostTheme theme={originalPost.theme}>{originalPost.content}</PostTheme>
                    ) : (
                        <PostContent>{originalPost.content}</PostContent>
                    )}
                </div>
                <div className="flex flex-col p-4 ml-8 rounded-xl border-2 border-graySoft dark:border-gray-700">
                    {/* Kiểm tra nếu retweetPost không tồn tại */}
                    {retweetPost ? (
                        <>
                            <PostMeta
                                timer={renderTime(retweetPost.createdAt)}
                                author={retweetPost.authorID}
                            ></PostMeta>
                            <div className="mt-3">
                                {retweetPost.type === "theme" ? (
                                    <PostTheme theme={retweetPost.theme}>
                                        {retweetPost.content}
                                    </PostTheme>
                                ) : (
                                    <PostContent>{retweetPost.content}</PostContent>
                                )}
                            </div>
                            {retweetPost.type === "image" && (
                                <PostImage
                                    src={retweetPost.listImg[0]}
                                    listImg={retweetPost.listImg}
                                ></PostImage>
                            )}
                            {retweetPost.type === "video" && (
                                <PostVideo src={retweetPost.linkVideo}></PostVideo>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-[200px] text-darkSoft2">
                            <h1 className="font-semibold">This post is no longer available!</h1>
                        </div>
                    )}
                </div>
                {/* Status */}
                <div className="py-3 ">
                    <div className="flex items-center gap-x-10 justify-between px-16">
                        <PostStatus
                            hoverColor="group-hover:bg-primaryBlue group-hover:text-primaryBlue"
                            textColor="group-hover:text-primaryBlue"
                            quantity={originalPost.commentCount}
                            className={
                                !originalPost.modeComment ? "pointer-events-none opacity-60" : ""
                            }
                            title="Comment"
                            onClick={() => setModalComment(true)}
                        >
                            {originalPost.modeComment ? (
                                <ChatBubbleOutlineOutlinedIcon className="text-xl"></ChatBubbleOutlineOutlinedIcon>
                            ) : (
                                <CommentsDisabledIcon className="text-xl"></CommentsDisabledIcon>
                            )}
                        </PostStatus>
                        <PostStatus
                            hoverColor="group-hover:bg-retweetColor group-hover:text-retweetColor"
                            textColor="group-hover:text-retweetColor"
                            quantity={0}
                            title="Retweet"
                            className="pointer-events-none opacity-50"
                        >
                            <RepeatIcon className="text-xl"></RepeatIcon>
                        </PostStatus>
                        <PostStatus
                            hoverColor="group-hover:bg-heartColor group-hover:text-heartColor"
                            quantity={likeCount}
                            textColor={
                                isLiked
                                    ? "text-heartColor"
                                    : "group-hover:text-heartColor transition-colors"
                            }
                            onClick={onLikePost}
                            title={isLiked ? "Unlike" : "Like"}
                        >
                            {isLiked ? (
                                <FavoriteIcon className="text-xl text-heartColor heart-active"></FavoriteIcon>
                            ) : (
                                <FavoriteBorderIcon className="text-xl heart-active"></FavoriteBorderIcon>
                            )}
                        </PostStatus>
                    </div>
                </div>
            </div>
            {modalComment && (
                <CommentFeature
                    modalComment={modalComment}
                    handleHideModal={() => setModalComment(false)}
                    post={originalPost}
                ></CommentFeature>
            )}
            <AlertDialog
                open={openDialog}
                setOpen={setOpenDialog}
                handleExtra={handleDeleteConfirm}
                textConfirm="You want to delete this post?"
                textSupport="This post will be permanently lost if you confirm."
            ></AlertDialog>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                message={textAlert}
                action={action}
            />
        </div>
    );
};

export default PostItemRetweet;
