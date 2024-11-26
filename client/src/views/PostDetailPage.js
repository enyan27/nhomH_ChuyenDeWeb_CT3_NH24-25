import BackPage from "components/common/BackPage";
import PostSkeleton from "components/skeleton/PostSkeleton";
import EmptyLayout from "layout/EmptyLayout";
import PostItem from "modules/posts/PostItem";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPostList } from "redux/posts/postRequest";

const PostDetail = () => {
  const { id } = useParams(); // Lấy ID bài viết từ URL
  const dispatch = useDispatch();
  const { loading, listPost, error } = useSelector(
    (state) => state.posts.getPost
  );

  // State lưu bài viết chi tiết
  const [postDetail, setPostDetail] = useState(null);

  useEffect(() => {
    // Gọi API để lấy danh sách bài viết
    dispatch(getPostList());
  }, [dispatch]);

  useEffect(() => {
    // Lọc bài viết chi tiết dựa vào ID
    const post = listPost?.find((post) => post._id === id);
    setPostDetail(post);
  }, [id, listPost]);

  return (
    <>
      <BackPage turnSwitchTab={-1}>
        <h4 className="py-2 text-xl font-bold">Post Detail</h4>
      </BackPage>
      <div className="py-4">
        {!loading ? (
          postDetail ? (
            // Hiển thị bài viết chi tiết
            <PostItem postInfo={postDetail}></PostItem>
          ) : (
            // Thông báo lỗi nếu bài viết không tồn tại
            <EmptyLayout
              linkImg="/img/profile-empty.png"
              info="This post does not exist or has been removed"
              support="Please come back later!"
            ></EmptyLayout>
          )
        ) : (
          // Hiển thị skeleton khi đang tải dữ liệu
          <PostSkeleton />
        )}
      </div>
    </>
  );
};

export default PostDetail;
