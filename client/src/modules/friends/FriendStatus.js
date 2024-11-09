import React from "react";
import useAddFriend from "hooks/useAddFriend";
import { Button, CircularProgress } from "@mui/material";

const FriendStatus = ({ className = "", status, isSender, userID }) => {
  const classGeneral = `${className} capitalize rounded-full`;
  const { loadingBtn, newStatus, handleInvite, handleCancel, handleAccept } =
    useAddFriend(userID, status);
  switch (newStatus) {
    case 1:
      return (
        <Button
          variant="outlined"
          className={`${classGeneral} hover:bg-graySoft hover:dark:bg-gray-700 text-primary border-primary dark:text-white dark:border-white`}
          onClick={handleCancel}
        >
          Unfriend
        </Button>
      );

    case 2: {
      if (!isSender)
        return (
          <>
            <Button
              variant="contained"
              className={`${classGeneral} bg-primary text-white ${
                loadingBtn && "pointer-events-none"
              }`}
              onClick={handleAccept}
            >
              {loadingBtn ? (
                <CircularProgress
                  style={{ width: "24px", height: "24px" }}
                  className="text-whiteSoft2 opacity-80"
                />
              ) : (
                "Accept"
              )}
            </Button>
            <Button
              variant="contained"
              className={
                classGeneral +
                "  bg-strock text-text1 dark:bg-darkStroke dark:text-white"
              }
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </>
        );
      return (
        <Button
          variant="contained"
          className={classGeneral + " bg-primary text-white"}
          onClick={handleCancel}
        >
          Waiting...
        </Button>
      );
    }

    default:
      return (
        <Button
          variant="contained"
          className={`${classGeneral} bg-primary text-white ${
            loadingBtn && "pointer-events-none"
          }`}
          onClick={handleInvite}
        >
          {loadingBtn ? (
            <CircularProgress
              style={{ width: "24px", height: "24px" }}
              className="text-whiteSoft2 opacity-80"
            />
          ) : (
            "Add friend"
          )}
        </Button>
        
      );
  }
};

export default FriendStatus;
