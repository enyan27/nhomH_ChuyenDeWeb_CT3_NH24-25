import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const BackPage = ({ children, haveBackBtn = true, turnSwitchTab }) => {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 flex items-center px-5 py-2 bg-white dark:bg-black bg-opacity-70 shadow-sm z-[100] gap-x-4 border-b border-graySoft dark:border-gray-700">
      {haveBackBtn && (
        <div
          className="flex items-center justify-center transition-colors bg-transparent rounded-full cursor-pointer w-9 h-9 hover:bg-graySoft hover:dark:bg-gray-700"
          onClick={() => navigate(turnSwitchTab || "/home")}
        >
          <ArrowBackIcon className="text-xl text-text1 dark:text-text4"></ArrowBackIcon>
        </div>
      )}
      {children}
    </div>
  );
};

BackPage.propTypes = {
  children: PropTypes.node,
  turnSwitchTab: PropTypes.any,
};

export default BackPage;
