import { useState, useEffect } from "react";
import axios from "api/config";
import Cookies from "js-cookie";

const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get("tokens");
        const config = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {};

        const response = await axios.get("/users", config);
        setUsers(response.data.listUser || []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách người dùng:", err);
        setError("Không thể tải danh sách người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /**
   * @param {string} userId
   * @param {object} updatedData
   */
  const updateUser = (userId, updatedData) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, ...updatedData } : user
      )
    );
  };

  return { users, loading, error, updateUser };
};

export default useFetchUsers;
