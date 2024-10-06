import React from "react";
import { Outlet } from "react-router-dom";
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
            Navbar here
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
