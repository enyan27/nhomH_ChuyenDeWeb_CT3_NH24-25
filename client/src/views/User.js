import React from "react";
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
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Sidebar from "components/admin/Sidebar";
import Header from "components/admin/Header";
import Footer from "components/admin/Footer";
import useFetchUsers from "hooks/useFetchUsers"; // Import hook sử dụng để tải danh sách người dùng
import "../styles/admin.scss";

const User = () => {
  const { users, loading, error } = useFetchUsers();

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Header />

        <div className="content user-list">
          <Typography variant="h4" gutterBottom>
            Danh sách người dùng
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          {loading ? (
            <CircularProgress style={{ display: "block", margin: "20px auto" }} />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Avatar</TableCell>
                    <TableCell>Tên người dùng</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Giới tính</TableCell>
                    <TableCell>Trạng thái hoạt động</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell>Ảnh bìa</TableCell>
                    <TableCell>Quyền</TableCell>
                    <TableCell>Trạng thái tài khoản</TableCell>
                    <TableCell>Số bài viết đã lưu</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user._id}>
                        {/* Avatar */}
                        <TableCell>
                          <Avatar
                            src={user.avatar || "/uploads/default-avatar.jpg"}
                            alt="Avatar"
                            style={{ width: 50, height: 50 }}
                          />
                        </TableCell>

                        {/* Tên người dùng */}
                        <TableCell>
                          {user.firstName} {user.lastName}
                        </TableCell>

                        {/* Email */}
                        <TableCell>{user.email}</TableCell>

                        {/* Giới tính */}
                        <TableCell>{user.gender === "male" ? "Nam" : "Nữ"}</TableCell>

                        {/* Trạng thái hoạt động */}
                        <TableCell>{user.isActive ? "Hoạt động" : "Không hoạt động"}</TableCell>

                        {/* Ngày tạo */}
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>

                        {/* Ảnh bìa */}
                        <TableCell>
                          <img
                            src={user.coverImg || "/uploads/cover-image-default.jpg"}
                            alt="Cover"
                            style={{ width: 50, height: 50, objectFit: "cover" }}
                          />
                        </TableCell>

                        {/* Quyền */}
                        <TableCell>{user.role || "Chưa xác định"}</TableCell>

                        {/* Trạng thái bị khóa */}
                        <TableCell>{user.isBan ? "Bị khóa" : "Hoạt động"}</TableCell>

                        {/* Số bài viết đã lưu */}
                        <TableCell>{user.listSaved.length || 0}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} align="center">
                        Không có người dùng nào.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default User;
