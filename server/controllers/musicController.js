const asyncHandler = require("express-async-handler");
const MusicModel = require("../models/MusicModel"); // Import model Music
const fs = require('fs');
const path = require('path');

// Lấy danh sách bài hát
const getListMusic = asyncHandler(async (req, res) => {
    try {
        const listMusic = await MusicModel.find().sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất
        res.json(listMusic);
    } catch (error) {
        res.status(500).json({ message: "Error fetching music list", error: error.message });
    }
});

// Lấy thông tin chi tiết một bài hát
const getMusicDetails = asyncHandler(async (req, res) => {
    try {
        const music = await MusicModel.findById(req.params.id);
        if (music) {
            res.json(music);
        } else {
            res.status(404).json({ message: "Music not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching music details", error: error.message });
    }
});

const addMusic = async (req, res) => {
    try {
        // Kiểm tra xem file có được tải lên chưa
        if (!req.files || !req.files.file) {
            return res.status(400).json({ message: "Music file is required." });
        }

        const { title, artist, genre, duration } = req.body;

        const newMusic = new MusicModel({
            title,
            artist,
            genre,
            duration,
            filePath: req.files.file[0].path,  // Đường dẫn đến tệp nhạc
            image: req.files.image ? req.files.image[0].path : "",  // Đường dẫn ảnh bìa nếu có
        });

        await newMusic.save();

        res.status(201).json({
            message: "Music added successfully",
            music: newMusic,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding music", error: error.message });
    }
};



module.exports = {
    addMusic,
};
// Cập nhật thông tin bài hát
const updateMusic = asyncHandler(async (req, res) => {
    try {
        const { title, artist, genre, duration } = req.body;
        const updatedData = {
            title,
            artist,
            genre,
            duration,
            filePath: req.file ? req.file.path : undefined,
            image: req.image ? req.image.path : undefined,
        };

        const updatedMusic = await MusicModel.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true } // Trả về bản ghi sau khi cập nhật
        );

        if (updatedMusic) {
            res.json(updatedMusic);
        } else {
            res.status(404).json({ message: "Music not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating music", error: error.message });
    }
});

// Xóa bài hát
const deleteMusic = asyncHandler(async (req, res) => {
    try {
        const music = await MusicModel.findById(req.params.id);
        if (!music) {
            return res.status(404).json({ message: "Music not found" });
        }

        // Xóa file mp3 và ảnh nếu có
        if (music.filePath) {
            fs.unlinkSync(path.join(__dirname, '..', music.filePath));
        }
        if (music.image) {
            fs.unlinkSync(path.join(__dirname, '..', music.image));
        }

        await MusicModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Music deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting music", error: error.message });
    }
});

module.exports = {
    getListMusic,
    getMusicDetails,
    addMusic,
    updateMusic,
    deleteMusic,
};
