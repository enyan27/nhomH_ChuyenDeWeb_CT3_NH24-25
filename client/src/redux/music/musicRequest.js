import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'api/config';
import Cookies from 'js-cookie';

// Lấy danh sách nhạc
export const getMusicList = createAsyncThunk(
  'music/list',
  async (_, { rejectWithValue , fulfillWithValue}) => {
    try {
      const res = await axios.get('/music', {
        headers: {
          authorization: 'Bearer ' + Cookies.get('tokens'),
        },
      });
      return fulfillWithValue(res.data?.musicList || [res.data]);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch music list'); // Trả về lỗi nếu có
    }
  }
);

// Thêm nhạc mới
export const addNewMusic = createAsyncThunk(
  'music/add',
  async ({ title, artist, genre, duration, file, image }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('genre', genre);
      formData.append('duration', duration);
      if (file) formData.append('file', file);
      if (image) formData.append('image', image);

      const res = await axios.post('/music', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: 'Bearer ' + Cookies.get('tokens'),
        },
      });

      return res.data;  // Trả về dữ liệu nhạc sau khi thêm thành công
    } catch (error) {
      console.log(error);  // In lỗi để debug
      return rejectWithValue(error.response?.data || 'Failed to add music'); // Xử lý lỗi trả về nếu có
    }
  }
);

// Cập nhật nhạc
export const updateMusic = createAsyncThunk(
  'music/update',
  async ({ musicId, updatedData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(updatedData).forEach((key) => {
        formData.append(key, updatedData[key]);
      });

      const res = await axios.put(`/music/${musicId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: 'Bearer ' + Cookies.get('tokens'),
        },
      });

      return res.data; // Trả về nhạc đã cập nhật
    } catch (error) {
      console.log(error);  // In lỗi để debug
      return rejectWithValue(error.response?.data || 'Failed to update music'); // Xử lý lỗi trả về nếu có
    }
  }
);

// Xóa nhạc
export const deleteMusic = createAsyncThunk(
  'music/delete',
  async (musicId, { rejectWithValue }) => {
    try {
      await axios.delete(`/music/${musicId}`, {
        headers: {
          authorization: 'Bearer ' + Cookies.get('tokens'),
        },
      });

      return musicId;  // Trả về ID của bài nhạc đã xóa
    } catch (error) {
      console.log(error);  // In lỗi để debug
      return rejectWithValue(error.response?.data || 'Failed to delete music'); // Xử lý lỗi trả về nếu có
    }
  }
);
