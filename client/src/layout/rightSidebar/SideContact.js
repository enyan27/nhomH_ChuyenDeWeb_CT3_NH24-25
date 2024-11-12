import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userFriend } from "redux/users/userRequest";
import { Avatar, Box, CircularProgress } from "@mui/material";
import TextHeading from "components/text/TextHeading";
import TextUsername from "components/text/TextUsername";
import { Link } from "react-router-dom";
import TextLight from "components/text/TextLight";

const SideContact = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userFriend({ status: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { listUsers, loading } = useSelector((state) => state.users?.friend);
  return (
<div className="ml-2 mt-6">
  <div className="mb-4">
    <h2 className="text-lg font-semibold">What's happening</h2>
    <div className="space-y-4 mt-4">
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500">Development · Trending</p>
          <p className="font-semibold">Next JS</p>
          <p className="text-gray-500">57.5K Tweets</p>
        </div>
        <i className="fas fa-ellipsis-h text-gray-500"></i>
      </div>
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500">Design · Trending</p>
          <p className="font-semibold">Figma</p>
          <p className="text-gray-500">107.5K Tweets</p>
        </div>
        <i className="fas fa-ellipsis-h text-gray-500"></i>
      </div>
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500">Design · Trending</p>
          <p className="font-semibold">Webflow</p>
          <p className="text-gray-500">127.5K Tweets</p>
        </div>
        <i className="fas fa-ellipsis-h text-gray-500"></i>
      </div>
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500">Development · Trending</p>
          <p className="font-semibold">Tailwind CSS</p>
          <p className="text-gray-500">87.5K Tweets</p>
        </div>
        <i className="fas fa-ellipsis-h text-gray-500"></i>
      </div>
      <div className="flex justify-between">
        <div>
          <p className="text-gray-500">Development · Trending</p>
          <p className="font-semibold">Vercel</p>
          <p className="text-gray-500">27.5K Tweets</p>
        </div>
        <i className="fas fa-ellipsis-h text-gray-500"></i>
      </div>
      <button className="text-blue-500">Show more</button>
    </div>
  </div>
  <div>
    <h2 className="text-lg font-semibold">Who to follow - {"<hardcode/>"}</h2>
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="https://placehold.co/50x50" alt="User avatar" className="rounded-full" />
          <div>
            <p className="font-semibold">User Name</p>
            <p className="text-gray-500">@username</p>
          </div>
        </div>
        <button className="bg-black text-white rounded-full px-5 py-2">Follow</button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="https://placehold.co/50x50" alt="User avatar" className="rounded-full" />
          <div>
            <p className="font-semibold">User Name</p>
            <p className="text-gray-500">@username</p>
          </div>
        </div>
        <button className="bg-black text-white rounded-full px-5 py-2">Follow</button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="https://placehold.co/50x50" alt="User avatar" className="rounded-full" />
          <div>
            <p className="font-semibold">User Name</p>
            <p className="text-gray-500">@username</p>
          </div>
        </div>
        <button className="bg-black text-white rounded-full px-5 py-2">Follow</button>
      </div>
    </div>
  </div>
</div>

    // <div className="mt-5 overflow-hidden rounded-xl bg-whiteSoft dark:bg-darkSoft">
    //   <TextHeading className="p-4">User contact</TextHeading>
    //   <div className="flex flex-col">
    //     {!loading ? (
    //       listUsers?.length > 0 ? (
    //         listUsers.map((user) => (
    //           <Link
    //             key={user?._id}
    //             to={"/profile/" + user?._id}
    //             className="flex items-center justify-between px-4 py-3 transition-all cursor-pointer hover:bg-graySoft hover:dark:bg-gray-700"
    //           >
    //             <div className="flex items-center gap-x-3">
    //               <Avatar
    //                 alt=""
    //                 src={user?.avatar}
    //                 sx={{ width: 40, height: 40 }}
    //               />
    //               <TextUsername>
    //                 {user?.firstName + " " + user?.lastName}
    //               </TextUsername>
    //             </div>
    //           </Link>
    //         ))
    //       ) : (
    //         <div className="flex flex-col items-center justify-center py-4 gap-y-3">
    //           <div className="text-center">
    //             <TextLight>No friends. Let's find friends!</TextLight>
    //           </div>
    //         </div>
    //       )
    //     ) : (
    //       <Box
    //         sx={{ display: "flex", justifyContent: "center", margin: "40px 0" }}
    //       >
    //         <CircularProgress />
    //       </Box>
    //     )}
    //   </div>
    // </div>
  );
};

export default SideContact;
