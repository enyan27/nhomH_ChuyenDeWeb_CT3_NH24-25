import React from "react";
import { useSelector } from "react-redux";
import Overlay from "components/common/Overlay";
import PostMeta from "./parts/PostMeta";
import ModalHeading from "components/modal/ModalHeading";
import PostAddTheme from "./create/PostAddTheme";
import PostAddImage from "./create/PostAddImage";
import ModalLine from "components/modal/ModalLine";
import PostAddVideo from "./create/PostAddVideo";
import PostAddRetweet from "./create/PostAddRetweet";

const PostAddNew = ({ handleHideModal, type, postToRetweet, onRetweetSuccess }) => {
  const { currentUser } = useSelector((state) => state.auth.login);

  const SelectPostType = ({ type }) => {
    switch (type) {
      case "image":
        return <PostAddImage />;
      case "video":
        return <PostAddVideo />;
      case "retweet":
        return (
          <PostAddRetweet
            postToRetweet={postToRetweet}
            handleHideModal={handleHideModal}
            onRetweetSuccess={onRetweetSuccess}
          />
        );
      default:
        return <PostAddTheme />;
    }
  };

  return (
    <Overlay handleHideModal={handleHideModal}>
      <div className="w-[550px] mx-auto bg-white dark:bg-darkSoft z-50 rounded-xl show-modal">
        <ModalHeading handleHideModal={handleHideModal}>
            Create new post
        </ModalHeading>
        <ModalLine />
        <div className="flex flex-col px-5 py-4">
          <PostMeta author={currentUser} showDate={false}></PostMeta>
          <SelectPostType type={type} />
        </div>
      </div>
    </Overlay>
  );
};

export default PostAddNew;

