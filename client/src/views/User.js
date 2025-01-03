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
  TextField,
  Button,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Sidebar from "components/admin/Sidebar";
import Header from "components/admin/Header";
import Footer from "components/admin/Footer";
import useFetchUsers from "hooks/useFetchUsers";
import axios from "api/config"; // Import axios để gửi yêu cầu API
import "../styles/admin.scss";

const User = () => {
  const { users, loading, error } = useFetchUsers();
  const [editingRole, setEditingRole] = useState(null);
  const [newRole, setNewRole] = useState(null);

  const handleRoleChange = async (userId, role) => {
    try {
      const response = await axios.patch(`/users/${userId}`, {
        role: role === 0 ? 1 : 0, // Chuyển đổi giữa 0 và 1
      });
      if (response.status === 200) {
        setNewRole(role === 0 ? 1 : 0);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật quyền:", err);
      alert("Không thể cập nhật quyền người dùng.");
    }
  };
  const handleAccountStatusChange = async (userId, status) => {
    try {
      const response = await axios.patch(`/users/${userId}`, {
        isBan: status === "1" ? true : false, 
      });
  
      if (response.status === 200) {
        alert("Cập nhật trạng thái tài khoản thành công!");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái tài khoản:", err);
      alert("Không thể cập nhật trạng thái tài khoản.");
    }
  };

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
                        <TableCell>
                          <Avatar
                            src={user.avatar || "/uploads/default-avatar.jpg"}
                            alt="Avatar"
                            style={{ width: 50, height: 50 }}
                          />
                        </TableCell>

                        <TableCell>
                          {user.firstName} {user.lastName}
                        </TableCell>

                        <TableCell>{user.email}</TableCell>

                        <TableCell>{user.gender === "male" ? "Nam" : "Nữ"}</TableCell>

                        <TableCell>{user.isActive ? "Hoạt động" : "Không hoạt động"}</TableCell>

                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>

                        <TableCell>
                          <img
                            src={user.coverImg || "/uploads/cover-image-default.jpg"}
                            alt="Cover"
                            style={{ width: 50, height: 50, objectFit: "cover" }}
                          />
                        </TableCell>

                        {/* Cột Quyền với khả năng sửa trực tiếp */}
                        <TableCell>
                          <TextField
                            select
                            value={user.role === 0 ? 0 : 1}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            variant="outlined"
                            size="small"
                            SelectProps={{
                              native: true,
                            }}
                          >
                            <option value={0}>User</option>
                            <option value={1}>Admin</option>
                          </TextField>
                        </TableCell>

                        <TableCell>
                          <TextField
                            select
                            value={user.isBan ? 1 : 0}
                            onChange={(e) => handleAccountStatusChange(user._id, e.target.value)}
                            variant="outlined"
                            size="small"
                            SelectProps={{
                              native: true,
                            }}
                          >
                            <option value={0}>Hoạt động</option>
                            <option value={1}>Khóa</option>
                          </TextField>
                        </TableCell>



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
