import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMusicList, addNewMusic, deleteMusic } from "redux/music/musicRequest";
import Header from "components/admin/Header";
import Footer from "components/admin/Footer";
import Sidebar from "components/admin/Sidebar";
import MusicList from "./MusicList";

const MusicForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    duration: "",
    file: null,
    image: null,
  });

  const [formError, setFormError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.file) {
      setFormError("Music file is required.");
      return;
    }
    setFormError("");
    onSubmit(formData);
    setFormData({
      title: "",
      artist: "",
      genre: "",
      duration: "",
      file: null,
      image: null,
    });
  };

  return (
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
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="artist"
        placeholder="Artist"
        value={formData.artist}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="genre"
        placeholder="Genre"
        value={formData.genre}
        onChange={handleInputChange}
        required
      />
      <input
        type="number"
        name="duration"
        placeholder="Duration (seconds)"
        value={formData.duration}
        onChange={handleInputChange}
        required
      />
      <input type="file" name="file" onChange={handleFileChange} required />
      <input type="file" name="image" onChange={handleFileChange} />
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
  );
};

const AdminMusic = () => {
  const dispatch = useDispatch();
  const { requests: musicList = [], loading, error } = useSelector((state) => state.music || {});

  useEffect(() => {
    dispatch(getMusicList());
  }, [dispatch]);

  const handleAddMusic = async (data) => {
    try {
      await dispatch(addNewMusic(data)).unwrap();
      alert("Music added successfully!");
      dispatch(getMusicList());
    } catch (err) {
      alert("Error adding music: " + err.message);
    }
  };

  const handleDeleteMusic = async (id) => {
    try {
      await dispatch(deleteMusic(id)).unwrap();
      alert("Music deleted successfully!");
      dispatch(getMusicList());
    } catch (err) {
      alert("Error deleting music: " + err.message);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Header />

        <div style={{ padding: "20px" }}>
          <h1>Admin Music Management</h1>
          <MusicForm onSubmit={handleAddMusic} />
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <MusicList musics={musicList} onDelete={handleDeleteMusic} />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AdminMusic;
