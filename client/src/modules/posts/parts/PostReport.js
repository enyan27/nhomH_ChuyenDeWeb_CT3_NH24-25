import React from "react";
import useToggle from "hooks/useToggle";
import useSnackbarInfo from "hooks/useSnackbarInfo";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import FlagIcon from "@mui/icons-material/Flag";
import PropTypes from "prop-types";
import Checkbox from "@mui/material/Checkbox";
import Snackbar from "@mui/material/Snackbar";
import axios from "api/config";
import Cookies from "js-cookie";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const PostReport = ({ isReported = false, postID = "" }) => {
  const [reported, setReported] = useToggle(isReported);
  const { action, handleClose, stateOpen } = useSnackbarInfo();

  const [open, setOpen] = stateOpen;

  const handleReported = async () => {
    try {
      setReported();
      await axios({
        method: "POST",
        url: "/posts/report/" + postID,
        headers: {
          authorization: "Bearer " + Cookies.get("tokens"),
        },
      });
      setOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Checkbox
        {...label}
        icon={<FlagOutlinedIcon className="text-iconColor" />}
        checkedIcon={<FlagIcon className="text-primary" />}
        checked={reported}
        className="dark:hover:bg-slate-700"
        onChange={handleReported}
      />
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={reported ? "Post reported" : "Report removed"}
        action={action}
      />
    </>
  );
};

PostReport.propTypes = {
  isReported: PropTypes.bool,
};

export default PostReport;
