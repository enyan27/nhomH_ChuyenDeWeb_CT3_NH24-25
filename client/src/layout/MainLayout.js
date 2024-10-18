import React, { useEffect } from "react";
import { socket } from "api/config";
import { Link, Outlet, useLocation } from "react-router-dom";
import SideNav from "./leftSidebar/SideNav";
import SideUserInfo from "./leftSidebar/SideUserInfo";
import useCheckLogin from "hooks/useCheckLogin";
import SidePassword from "./leftSidebar/SidePassword";

const MainLayout = () => {
  const { currentUser } = useCheckLogin();

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="relative flex items-start justify-between gap-x-8">
        <div className="sticky top-0 h-[100vh] flex-[1] flex flex-col justify-between z-[120] py-8">
          <div>
            <Link
              to={"/home"}
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="flex items-center gap-x-4"
            >
              <h3 className="text-2xl font-bold text-text2 dark:text-text4">
                Logo
              </h3>
            </Link>
            <SideNav></SideNav>
          </div>
          <div>
            <SideUserInfo
              avatar={currentUser?.avatar}
              username={
                currentUser &&
                currentUser?.firstName + " " + currentUser?.lastName
              }
              email={currentUser?.email}
              url={"/profile/" + currentUser?._id}
            >
              <SidePassword />
            </SideUserInfo>
          </div>
        </div>
        <div className="flex-[2.5] border-b border-x border-graySoft dark:border-gray-700 min-h-screen">
          <Outlet></Outlet>
        </div>

        <div className="sticky top-0 flex-[1.5] z-40 overflow-auto h-[100vh] py-4 scroll-custom mt-5">
          Search here
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
