const express = require("express");
const router = express.Router();
const MusicController = require("../controllers/musicController");
const upload = require("../utils/uploadStorage");

// Lấy danh sách bài hát
router.get("/", MusicController.getListMusic);

// Lấy chi tiết bài hát
router.get("/:id", MusicController.getMusicDetails);

router.post("/", upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), MusicController.addMusic);
router.put("/:id", upload.fields([{ name: 'file', maxCount: 1 }, { name: 'image', maxCount: 1 }]), MusicController.updateMusic);


// Xóa bài hát
router.delete("/:id", MusicController.deleteMusic);

module.exports = router;
