import { useState, useEffect } from "react";
import axios from "api/config";
import Cookies from "js-cookie";

const useFetchPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = Cookies.get("tokens");
        const config = token ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        } : {};
        const response = await axios.get("/posts", config);
        setPosts(response.data.listPost || []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách bài viết:", err);
        setError("Không thể tải danh sách bài viết.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
};

export default useFetchPosts;
