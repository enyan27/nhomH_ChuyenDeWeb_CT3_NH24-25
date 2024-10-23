import React, { useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';

import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { notifyList } from "redux/notify/notifyRequest";
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
    name: "Music",
    url: "/music",
    icon: <LibraryMusicIcon></LibraryMusicIcon>,
  },
  
  {
    name: "More",
    url: "/comming-soon",
    icon: <MoreHorizIcon ></MoreHorizIcon>,
  },
];

const SideNav = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navClass =
    "flex items-center justify-between px-5 py-4 transition-colors rounded-full hover:dark:bg-darkSoft hover:bg-graySoft";
  const { countNotSeen } = useSelector((state) => state.notify);
  useEffect(() => {
    setTimeout(() => dispatch(notifyList()), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    socket.connect();

    socket.on("receive-notify", (to) => {
      const decodedToken = jwtDecode(Cookies.get("tokens"));
      if (to.includes(decodedToken._id)) {
        dispatch(notifyList());
        toast.info("You have a new notification", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          {nav.name === "Notify" && countNotSeen > 0 && (
            <div className="flex items-center justify-center w-5 h-5 text-xs text-white rounded-full bg-heartColor">
              {countNotSeen}
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default SideNav;
