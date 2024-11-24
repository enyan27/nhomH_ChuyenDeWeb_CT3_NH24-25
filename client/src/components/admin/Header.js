import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "redux/auth/authRequest";
import { socket } from "api/config";

function Header() {
  const dispatch = useDispatch();

  const { currentUser} = useSelector((state) => state.auth.login);

  const handleLogout = () => {
    logoutUser(dispatch);
    socket.emit("logout-active", currentUser);
  };


  return (
    <header className="header">
      <h1>Admin Dashboard</h1>
      <div className="header-actions">
        <span>Welcome, Admin!</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;
