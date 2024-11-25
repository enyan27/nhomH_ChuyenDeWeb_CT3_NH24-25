const router = require("express").Router();
const upload = require("../utils/uploadStorage");
const {
  getUserList,
  getUserDetail,
  handleUpdateInfo,
  handleDeleteImage,
  handleSearchHistory,
  handleRemoveSearch,
  deleteUser
} = require("../controllers/userController");
const { handleAccountStatusChange } = require("../controllers/userController");

const verifyToken = require("../middleWare/verifyToken");
const verifyAdmin = require("../middleWare/verifyAdmin");

router.get("/", verifyToken, getUserList);
router.get("/:id", verifyToken, getUserDetail);
router.post("/search", verifyToken, handleSearchHistory);
router.delete("/search/:slug", verifyToken, handleRemoveSearch);
router.put(
  "/update-info",
  verifyToken,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImg", maxCount: 1 },
  ]),
  handleUpdateInfo
);
router.delete("/image/:id", verifyToken, handleDeleteImage);

router.patch("/:id/status", verifyToken, handleAccountStatusChange);

router.delete("/delete/:id", deleteUser);

module.exports = router;
