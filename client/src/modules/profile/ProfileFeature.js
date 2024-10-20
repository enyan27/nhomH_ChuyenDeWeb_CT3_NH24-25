import React from "react";
import useToggle from "hooks/useToggle";
import { Button, IconButton, Snackbar, Tooltip } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate, useParams } from "react-router-dom";
import useSnackbarInfo from "hooks/useSnackbarInfo";

const ProfileFeature = ({ yourSelf, status = 3, isSender = true, chatID }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const classGeneral = "px-4 py-1 font-semibold";
  const [showEdit, setShowEdit] = useToggle(false);
  const { action, handleClose, stateOpen } = useSnackbarInfo();
  const [open, setOpen] = stateOpen;
  return (
    <>
      <div className="flex items-center justify-end py-3 gap-x-3">
        <Tooltip title="Copy link to profile">
          <IconButton
            className="hover:bg-graySoft hover:dark:bg-gray-600"
            style={{ border: "1px solid #ccc" }}
            aria-label="copy link"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            <LinkIcon className="text-lg text-iconColor" />
          </IconButton>
        </Tooltip>

        {yourSelf ? (
          <Button
            variant="outlined"
            className={`${classGeneral} rounded-full capitalize hover:bg-graySoft hover:dark:bg-gray-600 text-text1 dark:text-white border-strock dark:border-gray-700`}
            onClick={setShowEdit}
          >
            Edit profile
          </Button>
        ) : (
          <>
            {status === 1 && chatID && (
              <Tooltip
                title="Send Message"
                onClick={() => navigate("/chats/t/" + chatID?._id)}
              >
                <IconButton
                  className="hover:bg-graySoft hover:dark:bg-gray-600"
                  style={{ border: "1px solid rgb(107, 114, 128)" }}
                  aria-label="send message"
                >
                  <SendIcon className="text-lg text-iconColor" />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Updated successful"
        action={action}
      />
    </>
  );
};

export default ProfileFeature;
