import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const Authentication = ({ children, heading }) => {
  const tokens = Cookies.get("tokens");
  const navigate = useNavigate();
  useEffect(() => {
    if (tokens) {
      const decodedToken = jwtDecode(tokens);
      decodedToken && navigate("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="w-full h-[100vh] flex items-center">
      <div className="w-[500px] mx-auto grid gap-x-8">
        <div className="flex flex-col gap-y-8">
          <h2 className="text-center font-bold text-primary leading-[90px] text-[50px]">
            {heading}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};

Authentication.propTypes = {
  children: PropTypes.node.isRequired,
  heading: PropTypes.string,
};

export default Authentication;
