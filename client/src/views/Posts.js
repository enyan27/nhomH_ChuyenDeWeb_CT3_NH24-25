import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,  // Import IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";  // Import DeleteIcon
import Alert from "@mui/material/Alert";
import Sidebar from "components/admin/Sidebar";
import Header from "components/admin/Header";
import Footer from "components/admin/Footer";
import useFetchPosts from "hooks/useFetchPosts";
import axios from "api/config";  // Import axios
import "../styles/admin.scss";
import Cookies from "js-cookie";

const Post = () => {
  const { posts, loading, error } = useFetchPosts();
  const [open, setOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);

  const handleOpenDialog = (images) => {
    setCurrentImages(images);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentImages([]);
  };

  const handleDeletePost = async (postId) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa bài viết này?");
    if (!isConfirmed) return;
  
    try {
      const token = Cookies.get("tokens");
  
      const response = await axios.delete(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        alert("Bài viết đã được xóa!");
        window.location.reload();
      }
    } catch (err) {
      console.error("Lỗi khi xóa bài viết:", err);
      if (err.response && err.response.status === 404) {
        alert("Bài viết không tồn tại.");
      } else {
        alert("Không thể xóa bài viết.");
      }
    }
  };
  
  

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Header />

        <div className="content post-list">
          <Typography variant="h4" gutterBottom>
            Danh sách bài viết
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          {loading ? (
            <CircularProgress style={{ display: "block", margin: "20px auto" }} />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Người viết</b></TableCell>
                    <TableCell><b>Nội dung</b></TableCell>
                    <TableCell><b>Loại bài viết</b></TableCell>
                    <TableCell><b>Hình ảnh</b></TableCell>
                    <TableCell><b>Lượt thích</b></TableCell>
                    <TableCell><b>Chế độ bình luận</b></TableCell>
                    <TableCell><b>Video</b></TableCell>
                    <TableCell><b>Bài viết được retweet</b></TableCell>
                    <TableCell><b>Ngày tạo</b></TableCell>
                    <TableCell><b>Thao tác</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <TableRow key={post._id}>
                        <TableCell>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              src={post.authorID?.avatar || "/uploads/default-avatar.jpg"}
                              alt="Avatar"
                              style={{ marginRight: 8 }}
                            />
                            <div>
                              {post.authorID?.firstName} {post.authorID?.lastName}
                              <br />
                              <small>{post.authorID?.email}</small>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          {post.content?.length > 50
                            ? `${post.content.substring(0, 50)}...`
                            : post.content}
                        </TableCell>

                        <TableCell>{post.type}</TableCell>

                        <TableCell>
                          {post.listImg?.length > 0 ? (
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                              {post.listImg.slice(0, 4).map((img, index) => (
                                <img
                                  key={index}
                                  src={img}
                                  alt={`Post Image ${index + 1}`}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: "cover",
                                    borderRadius: 4,
                                  }}
                                />
                              ))}
                              {post.listImg.length > 4 && (
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleOpenDialog(post.listImg)}
                                >
                                  +{post.listImg.length - 4} hình
                                </Typography>
                              )}
                            </div>
                          ) : (
                            "Không có hình ảnh"
                          )}
                        </TableCell>

                        <TableCell>{post.listHeart?.length || 0}</TableCell>

                        <TableCell>{post.modeComment ? "Bật" : "Tắt"}</TableCell>

                        <TableCell>
                          {post.linkVideo ? (
                            <a
                              href={post.linkVideo}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Xem video
                            </a>
                          ) : (
                            "Không có video"
                          )}
                        </TableCell>

                        <TableCell>
                          {post.retweetPost ? (
                            <a
                              href={`/posts/${post.retweetPost}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Xem bài viết
                            </a>
                          ) : (
                            "Không có retweet"
                          )}
                        </TableCell>

                        <TableCell>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </TableCell>

                        <TableCell>
                          <IconButton
                            color="error"
                            onClick={() => handleDeletePost(post._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        Không có bài viết nào.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>

        <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogContent>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {currentImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Detailed Image ${index + 1}`}
                  style={{
                    width: "100%",
                    maxWidth: 200,
                    height: "auto",
                    borderRadius: 4,
                  }}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </div>
  );
};

export default Post;
