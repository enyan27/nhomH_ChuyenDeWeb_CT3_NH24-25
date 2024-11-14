import React, { useEffect } from "react";
import useChangeValue from "hooks/useChangeValue";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userFriend } from "redux/users/userRequest";
import BackPage from "components/common/BackPage";
import Search from "components/search/Search";
import EmptyLayout from "layout/EmptyLayout";
import FriendItem from "modules/friends/FriendItem";
import FriendList from "modules/friends/FriendList";
import FriendSkeleton from "components/skeleton/FriendSkeleton";
import { filterUser } from "redux/users/userSlice";
import useFetchMore from "hooks/useFetchMore";

const FriendPage = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.users?.friend);
  const [searchParams, setSearchParams] = useSearchParams();
  const { value: query, handleChange } = useChangeValue(
    searchParams.get("name") || ""
  );
  useEffect(() => {
    document.title = "Twitter | Friends";
    const filterName = {
      ...filters,
      name: query,
    };
    if (!query) searchParams.delete("name");
    else searchParams.set("name", query);
    setSearchParams(searchParams);
    dispatch(filterUser(filterName));
    dispatch(userFriend(filterName));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);
  const { listUsers, loading } = useSelector((state) => state.users?.friend);
  const { hasMore, countItem, fetchMoreData } = useFetchMore(
    listUsers?.length,
    6,
    4
  );
  return (
    <>
      <BackPage haveBackBtn={false}>
        <div className="flex flex-col px-4">
          <h4 className="text-lg font-bold">Friends</h4>
          <p className="text-[13px] font-normal text-text4">
            {listUsers.filter((user) => user?.status === 1).length} friends
          </p>
        </div>
      </BackPage>
      <div className="flex flex-col px-4 py-3 gap-y-4">
        <Search
          onChange={handleChange}
          placeholder="Search username"
          isSuggested={false}
          className="py-[14px]"
          icon="user"
          defaultValue={query}
        ></Search>
        {listUsers.length > 0 ? (
          <FriendList
            dataLength={countItem}
            next={fetchMoreData}
            hasMore={hasMore}
          >
            {!loading ? (
              listUsers.map((user) => (
                <FriendItem
                  key={user?._id}
                  userID={user?._id}
                  src={user?.avatar}
                  fullName={user?.firstName + " " + user?.lastName}
                  email={user?.email}
                  linkInfo={"/profile/" + user?._id}
                  status={user?.status}
                  isSender={user?.isSender}
                ></FriendItem>
              ))
            ) : (
              <>
                <FriendSkeleton></FriendSkeleton>
                <FriendSkeleton></FriendSkeleton>
              </>
            )}
          </FriendList>
        ) : (
          <EmptyLayout
            linkImg=""
            info="No users available to connect with."
            support="Please come back later!"
            className="h-[300px] gap-y-6"
          ></EmptyLayout>
        )}
      </div>
    </>
  );
};

export default FriendPage;
