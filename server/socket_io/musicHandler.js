const MusicModel = require("../models/MusicModel");

const musicHandler = (socket, io) => {
  socket.on("addMusic", async (musicData) => {
    try {
      const newMusic = new MusicModel(musicData);
      const savedMusic = await newMusic.save();
      io.emit("musicAdded", savedMusic); // Gửi sự kiện đến tất cả người dùng
    } catch (error) {
      console.log("Error adding music:", error);
    }
  });

  socket.on("updateMusic", async (musicData) => {
    try {
      const updatedMusic = await MusicModel.findByIdAndUpdate(
        musicData._id,
        musicData,
        { new: true }
      );
      io.emit("musicUpdated", updatedMusic); // Phát sự kiện cập nhật đến tất cả người dùng
    } catch (error) {
      console.log("Error updating music:", error);
    }
  });

  socket.on("deleteMusic", async (musicId) => {
    try {
      await MusicModel.findByIdAndDelete(musicId);
      io.emit("musicDeleted", musicId); // Phát sự kiện xóa đến tất cả người dùng
    } catch (error) {
      console.log("Error deleting music:", error);
    }
  });
};

module.exports = musicHandler;
