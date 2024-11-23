import { useState, useEffect } from "react";
import axios from "api/config";

const useFetchMusic = () => {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMusics = async () => {
      setLoading(true);
      setError(null); // Reset lỗi trước khi gọi API

      try {
        const response = await axios.get("/music", {
          headers: {
            authorization: `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)tokens\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
          },
        });

        // Cập nhật danh sách bài hát
        setMusics(response.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Có lỗi xảy ra khi lấy danh sách bài hát");
      } finally {
        setLoading(false); // Dừng trạng thái loading
      }
    };

    fetchMusics();
  }, []); // Gọi API một lần khi component mount

  return { musics, loading, error };
};

export default useFetchMusic;
