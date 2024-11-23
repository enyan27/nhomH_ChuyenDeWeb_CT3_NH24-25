import React from 'react';

function Header() {
    return (
        <header className="header">
            <h1>Admin Dashboard</h1>
            <div className="header-actions">
                <span>Welcome, Admin!</span>
                <button>Logout</button>
            </div>
        </header>
    );
}

export default Header;
