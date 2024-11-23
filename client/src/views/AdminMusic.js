import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMusicList, addNewMusic, deleteMusic } from "redux/music/musicRequest";

const AdminMusic = () => {
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux và cung cấp giá trị mặc định cho trường hợp chưa có state
  const { requests: musicList = [], loading, error } = useSelector(
    (state) => state.music || {}
  );

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    duration: "",
    file: null,
    image: null,
  });

  const [formError, setFormError] = useState("");  // Trạng thái lỗi khi gửi form

  // Fetch music list khi component mount
  useEffect(() => {
    dispatch(getMusicList());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, artist, genre, duration, file, image } = formData;
    const newMusic = { title, artist, genre, duration, file, image };

    // Kiểm tra lỗi
    if (!file) {
      setFormError("Music file is required.");
      return;
    }

    setFormError("");  // Reset lỗi nếu không có vấn đề gì

    try {
      await dispatch(addNewMusic(newMusic)).unwrap();
      alert("Music added successfully!");
      setFormData({
        title: "",
        artist: "",
        genre: "",
        duration: "",
        file: null,
        image: null,
      });
      dispatch(getMusicList()); // Refresh list
    } catch (err) {
      alert("Error adding music: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteMusic(id)).unwrap();
      alert("Music deleted successfully!");
      dispatch(getMusicList()); // Refresh list after delete
    } catch (err) {
      alert("Error deleting music: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Music Management</h1>

      {/* Add New Music Form */}
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          maxWidth: "500px",
          margin: "0 auto",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2>Add New Music</h2>

        {formError && (
          <div
            style={{
              color: "red",
              padding: "10px",
              backgroundColor: "#f8d7da",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            {formError}
          </div>
        )}

        <input
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <input
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          type="text"
          name="artist"
          placeholder="Artist"
          value={formData.artist}
          onChange={handleInputChange}
          required
        />
        <input
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          type="text"
          name="genre"
          placeholder="Genre"
          value={formData.genre}
          onChange={handleInputChange}
          required
        />
        <input
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          type="number"
          name="duration"
          placeholder="Duration (seconds)"
          value={formData.duration}
          onChange={handleInputChange}
          required
        />
        <input
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          type="file"
          name="file"
          onChange={handleFileChange}
          required
        />
        <input
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          type="file"
          name="image"
          onChange={handleFileChange}
        />
        <button
          style={{
            padding: "12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
          type="submit"
        >
          Add Music
        </button>
      </form>

      {/* Music List */}
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>Music List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>Error: {error}</p>
        ) : musicList.length > 0 ? (
          musicList.map((music) => (
            <div
              key={music._id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
                gap: "15px",
                padding: "15px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={music.image || "https://via.placeholder.com/100"}
                alt={music.title}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <div>
                <h3>{music.title}</h3>
                <p>
                  <strong>Artist:</strong> {music.artist}
                </p>
                <p>
                  <strong>Genre:</strong> {music.genre}
                </p>
                <p>
                  <strong>Duration:</strong> {Math.floor(music.duration / 60)}:
                  {music.duration % 60} min
                </p>
              </div>
              <button
                onClick={() => handleDelete(music._id)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#FF6347",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No music available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminMusic;
