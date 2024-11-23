import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMusicList, deleteMusic } from "redux/music/musicRequest"; // Import các action

const MusicList = () => {
  const dispatch = useDispatch();

  const { requests: musicList = [], loading, error } = useSelector(
    (state) => state.music || {}  // Đảm bảo lấy đúng state.music
  );

  useEffect(() => {
    dispatch(getMusicList()); // Gọi action để lấy danh sách nhạc khi component mount
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteMusic(id)).unwrap(); // Xóa nhạc
      alert("Music deleted successfully!");
      dispatch(getMusicList()); // Làm mới danh sách sau khi xóa
    } catch (err) {
      alert("Error deleting music: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Music List</h1>

      {/* Kiểm tra trạng thái loading và lỗi */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <div>
          {musicList.length > 0 ? (
            musicList.map((music) => (
              <div key={music._id}>
                <h3>{music.title}</h3>
                <p>{music.artist}</p>
                <button onClick={() => handleDelete(music._id)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No music available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MusicList;
