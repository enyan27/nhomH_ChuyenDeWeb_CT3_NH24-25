import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ButtonGradient from "components/button/ButtonGradient";
import PostMeta from "../parts/PostMeta";
import { retweetPost } from "redux/posts/postRequest";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import renderTime from "utils/renderTime";
import PostContent from "../parts/PostContent";
import PostImage from "../parts/PostImage";
import PostVideo from "../parts/PostVideo";
import PostTheme from "../parts/PostTheme"; // Import thêm PostTheme

const PostAddRetweet = ({ postToRetweet, handleHideModal, onRetweetSuccess }) => {
    const { currentUser } = useSelector((state) => state.auth.login);
    const dispatch = useDispatch();
    const {
        handleSubmit,
        register,
        reset,
        formState: { isDirty },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            content: "",
        },
    });
    const handleRetweet = (value) => {
        const data = {
            content: value.content,
            retweetPostID: postToRetweet._id,
        };
        dispatch(retweetPost(data))
            .unwrap()
            .then(() => {
                onRetweetSuccess();
                handleHideModal();
                reset();
            });
    };

    return (
        <form onSubmit={handleSubmit(handleRetweet)} className="mt-3 select-none">
            <div className="max-h-[60vh] overflow-auto scroll-custom">
                <TextareaAutosize
                    aria-label="empty textarea"
                    minRows={3}
                    placeholder={`Hi ${currentUser?.firstName}, what's on your mind?`}
                    className="w-full mb-8 overflow-auto text-base font-normal bg-transparent scroll-custom"
                    {...register("content")}
                />
                {/* Post được retweet */}
                {postToRetweet && (
                    <div className="flex flex-col p-4 rounded-xl border-2 border-graySoft dark:border-gray-700">
                        <PostMeta
                            timer={renderTime(postToRetweet.createdAt)}
                            author={postToRetweet.authorID}
                        ></PostMeta>
                        <div className="mt-3">
                            {/* Kiểm tra và hiển thị dạng theme */}
                            {postToRetweet.type === "theme" && postToRetweet.theme ? (
                                <PostTheme theme={postToRetweet.theme}>
                                    {postToRetweet.content}
                                </PostTheme>
                            ) : (
                                <>
                                    <PostContent>{postToRetweet.content}</PostContent>
                                    {postToRetweet.type === "image" && postToRetweet.listImg && (
                                        <PostImage
                                            src={postToRetweet.listImg[0]}
                                            listImg={postToRetweet.listImg}
                                        ></PostImage>
                                    )}
                                    {postToRetweet.type === "video" && postToRetweet.linkVideo && (
                                        <PostVideo src={postToRetweet.linkVideo}></PostVideo>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <ButtonGradient
                type="submit"
                className={`w-full py-3 mt-4 text-base font-bold rounded-md ${!isDirty && "pointer-events-none opacity-40"
                    }`}
            >
                Retweet
            </ButtonGradient>
        </form>
    );
};

export default PostAddRetweet;
