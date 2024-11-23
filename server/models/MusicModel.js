const mongoose = require('mongoose');

// Tạo schema cho bài hát
const musicSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  artist: { 
    type: String, 
    required: true 
  },
  genre: { 
    type: String, 
    enum: ['Pop', 'Rock', 'Hip-hop', 'Jazz', 'Classical', 'Other'], 
    default: 'Other' 
  },
  duration: { 
    type: Number, 
    required: true 
  }, // Thời lượng bài hát (tính bằng giây)
  filePath: { 
    type: String, 
    required: true 
  }, // Đường dẫn đến file MP3
  image: { 
    type: String, 
  }, // Đường dẫn hoặc URL của ảnh bìa
}, {
  timestamps: true, // Tự động thêm createdAt và updatedAt
});

module.exports = mongoose.model('Music', musicSchema);
