import React, { useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "api/config";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import SearchIcon from '@mui/icons-material/Search';
import PublicIcon from '@mui/icons-material/Public';

const listNav = [
  {
    name: "Home",
    url: "/home",
    icon: <HomeIcon></HomeIcon>,
  },
  {
    name: "Friends",
    url: "/friends",
    icon: <PeopleOutlineIcon></PeopleOutlineIcon>,
  },
  {
    name: "Bookmarks",
    url: "/post-saved",
    icon: <BookmarkBorderIcon></BookmarkBorderIcon>,
  },
  {
    name: "Notifications",
    url: "/notify",
    icon: <NotificationsNoneIcon></NotificationsNoneIcon>,
  },
  {
    name: "Messages",
    url: "/chats",
    icon: <ChatBubbleOutlineIcon ></ChatBubbleOutlineIcon>,
  },
  {
    name: "More",
    url: "/comming-soon",
    icon: <MoreHorizIcon ></MoreHorizIcon>,
  },
];

const SideNav = () => {
  const navClass =
    "flex items-center justify-between px-5 py-4 transition-colors rounded-full hover:dark:bg-darkSoft hover:bg-graySoft";

  return (
    <nav className="flex flex-col mt-10 gap-y-3">
      {listNav.map((nav) => (
        <NavLink
          className={({ isActive }) =>
            isActive
              ? `${navClass} dark:bg-slate-700 bg-slate-200 pointer-events-none`
              : navClass
          }
          to={nav.url}
          key={nav.name}
        >
          <div className="flex items-center gap-x-3 text-text3 dark:text-text4">
            {nav.icon}
            <span className="text-base leading-6 capitalize">{nav.name}</span>
          </div>
        </NavLink>
      ))}
    </nav>
  );
};

export default SideNav;
