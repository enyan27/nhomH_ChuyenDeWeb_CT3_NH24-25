import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { NavLink } from "react-router-dom";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const listNav = [
  {
    name: "Home",
    url: "/home",
    icon: <HomeIcon></HomeIcon>,
  },
  {
    name: "Bookmarks",
    url: "/post-saved",
    icon: <BookmarkBorderIcon></BookmarkBorderIcon>,
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
