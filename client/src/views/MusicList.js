import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Alert, Card, CardContent, CardMedia, Typography } from "@mui/material";

const MusicList = () => {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/music", {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzNjMzNkMzAzZjcxZWFjYzZmMWQyNTkiLCJpYXQiOjE3MzIzMzA2NTgsImV4cCI6MTczNDkyMjY1OH0.1nGEApDscvZKj4zCDcwPTwgp73FIuXGSg4cXQJAoJ1s",
          },
        });

        if (response.data && response.data.success) {
          setMusicList(response.data.data || []);
        } else {
          setError(response.data.message || "Failed to fetch music.");
        }
      } catch (error) {
        console.error("Error fetching music:", error);
        setError("Failed to load music. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, []);

  // Hiển thị Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center py-5">
        <CircularProgress />
      </div>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <div className="flex justify-center items-center py-5">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  // Hiển thị danh sách bài hát
  return (
    <div className="py-3">
      <h4 className="text-lg font-bold text-center mb-6">Danh sách bài hát</h4>
      {musicList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {musicList.map((music) => (
            <Card
              key={music._id}
              sx={{
                maxWidth: 345,
                boxShadow: 3,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 8,
                },
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={music.image ? `http://localhost:8080/uploads/${music.image}` : "https://via.placeholder.com/150"}
                alt="Music cover"
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {music.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {music.artist} | {music.genre}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {Math.floor(music.duration / 60)} phút {music.duration % 60} giây
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Không có bài hát nào.</p>
      )}
    </div>
  );
};

export default MusicList;
