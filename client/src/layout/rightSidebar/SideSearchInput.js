import React, { useState } from "react";
import Search from "components/search/Search";
import Cookies from "js-cookie";
import axios from "api/config";
import { getSearchHistory } from "redux/users/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SideSearchInput = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  const validateQuery = (query) => {
    // Kiểm tra độ dài từ khóa tìm kiếm
    if (query.length > 25) {
      toast.error("Từ khóa tìm kiếm không được vượt quá 20 ký tự.");
      return false;
    }

    // Kiểm tra nếu từ khóa tìm kiếm chứa số hoặc là số
    if (/\d/.test(query) && !query.includes("@")) {
      toast.error("Từ khóa tìm kiếm không được chứa số.");
      return false;
    }

    return true;
  };

  const handleEnterKey = async (e) => {
    try {
      if (e.which === 13 && query) {
        // Kiểm tra từ khóa trước khi gửi yêu cầu
        if (!validateQuery(query)) {
          setQuery(""); // Reset lại query nếu không hợp lệ
          return;
        }

        // Chuyển hướng tới trang tìm kiếm
        navigate("/search?q=" + query);

        // Gửi yêu cầu tìm kiếm tới backend
        const res = await axios({
          method: "POST",
          url: "/users/search?keyword=" + query,
          headers: {
            authorization: "Bearer " + Cookies.get("tokens"),
          },
        });

        // Lưu lịch sử tìm kiếm vào Redux nếu không có lỗi từ API
        dispatch(getSearchHistory(res?.data));
      }
    } catch (error) {
      // Hiển thị thông báo lỗi khi có sự cố từ API hoặc mạng
      if (error.response) {
        toast.error(error.response.data || "Có lỗi xảy ra, vui lòng thử lại.");
      } else {
        toast.error("Không thể kết nối đến máy chủ.");
      }
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <Search value={query} onChange={handleChange} onKeyDown={handleEnterKey} />
    </div>
  );
};

export default SideSearchInput;
