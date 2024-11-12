import React from "react";
import FriendSkeleton from "components/skeleton/FriendSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";

const FriendList = ({ className, children, ...props }) => {
  return (
    <InfiniteScroll
    // Fix UI - Friend list
      className={`grid grid-cols-1 ${className} gap-x-5 gap-y-4`}
      loader={
        <>
          <FriendSkeleton />
          <FriendSkeleton />
        </>
      }
      scrollableTarget="scrollableDiv"
      {...props}
    >
      {children}
    </InfiniteScroll>
  );
};

export default FriendList;
