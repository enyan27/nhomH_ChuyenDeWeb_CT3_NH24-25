import React, { useEffect } from "react";
import useFetchMore from "hooks/useFetchMore";
import { useDispatch, useSelector } from "react-redux";
import { getPostList } from "redux/posts/postRequest";
import PostFeature from "modules/posts/PostFeature";
import PostItem from "modules/posts/PostItem";
import PostSkeleton from "components/skeleton/PostSkeleton";
import PostList from "modules/posts/PostList";
import BackPage from "components/common/BackPage";

const HomePage = () => {
  const { currentUser } = useSelector((state) => state.auth.login);
  const dispatch = useDispatch();
  useEffect(() => {
    document.title = "Twitter | Home";
    dispatch(getPostList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { listPost, loading: getPostLoading } = useSelector(
    (state) => state.posts.getPost
  );
  const { hasMore, countItem, fetchMoreData } = useFetchMore(listPost?.length);
  return (
    <>
    {/* Fix UI - Post header */}
      <BackPage haveBackBtn={false}>
        <div className="flex flex-col px-2">
          <h4 className="text-lg font-bold">Home</h4>
          <p className="text-[13px] font-normal text-text4">
            For you | Following
          </p>
        </div>
      </BackPage>
    {/* Fix UI - Post list */}
      <div className="py-3">
        <PostFeature
          username={currentUser?.lastName}
          avatar={currentUser?.avatar}
          linkInfo={"/profile/" + currentUser?._id}
        ></PostFeature>
        <PostList dataLength={countItem} next={fetchMoreData} hasMore={hasMore}>
          {listPost?.length > 0 && !getPostLoading ? (
            listPost.map(
              (post, i) =>
                i < countItem && (
                  <PostItem key={post._id} postInfo={post}></PostItem>
                )
            )
          ) : (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          )}
        </PostList>
      </div>
    </>
  );
};

export default HomePage;
