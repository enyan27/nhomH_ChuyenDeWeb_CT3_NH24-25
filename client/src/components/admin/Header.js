import React from 'react';
import { useNavigate } from 'react-router-dom'; // Thay useHistory bằng useNavigate
import Cookies from 'js-cookie'; // Để thao tác với cookie
import axios from 'axios'; // Để gửi yêu cầu API

function Header() {
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng trang

  const handleLogout = async () => {
    try {
      // Gửi yêu cầu POST để đăng xuất
      await axios.post('/api/logout');

      // Xóa cookie chứa token
      Cookies.remove('tokens');

      // Điều hướng người dùng về trang đăng nhập
      navigate('/login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
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
