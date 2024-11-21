import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import TextLight from "components/text/TextLight";
import FriendStatus from "./FriendStatus";
import TextUsername from "components/text/TextUsername";

const FriendItem = ({
  src,
  email,
  status = 3,
  isSender = true,
  linkInfo = "/",
  userID = "",
  fullName,
}) => {
  return (
    <div className="flex items-center justify-between p-4 h-[80px] border rounded-xl border-strock dark:border-darkStroke">
      <Link to={linkInfo} className="flex items-center">
        <Avatar
          alt={fullName}
          src={src}
          sx={{ width: 50, height: 50 }}
          className="mr-4"
        />
        <div className="flex flex-col">
          <TextUsername type="bold" className="text-lg">
            {fullName}
          </TextUsername>
          <TextLight>{email}</TextLight>
        </div>
      </Link>
      {status !== -1 && (
        <FriendStatus
          className="p-[10px] text-base font-semibold px-[30px]"
          status={status}
          isSender={isSender}
          userID={userID}
        />
      )}
    </div>
  );
};

FriendItem.propTypes = {
  src: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  isSender: PropTypes.bool,
  status: PropTypes.number,
  linkInfo: PropTypes.string,
};

export default FriendItem;
