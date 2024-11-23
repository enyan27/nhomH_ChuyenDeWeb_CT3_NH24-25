import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Admin Panel</h2>
            <nav>
                <Link to="/admin/users" className="menu-item">Users</Link>
                <Link to="/admin/posts" className="menu-item">Posts</Link>
            </nav>
        </div>
    );
}

export default Sidebar;
