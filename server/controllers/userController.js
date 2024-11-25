const asyncHandler = require("express-async-handler");
const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");
const FriendModel = require("../models/FriendModel");
const ImageModel = require("../models/ImageModel");
const cloudinary = require("../config/cloudinary");
const ChatModel = require("../models/ChatModel");
const NotifyModel = require("../models/NotifyModel");
const shuffleArray = require("../utils/shuffleArray");
const removeTones = require("../utils/removeTones");
const getAllFriend = require("../utils/getAllFriend");

let monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getUserList = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    const { gender, name } = req.query;  // Lấy thông tin từ query
    const filterQuery = (key, query) => query && { [key]: query };

    // Lấy danh sách người dùng ngoại trừ email hiện tại
    let listUser = await UserModel.find(
      {
        email: { $ne: username.email },
        ...filterQuery("gender", gender),  // Lọc theo giới tính nếu có
      },
      { password: 0 }  // Bỏ password khỏi kết quả
    );

    // Nếu có từ khóa "name", lọc danh sách theo firstName, lastName hoặc email
    if (name) {
      const nameWithoutTones = removeTones(name.toLowerCase()); // Loại bỏ dấu từ từ khóa tìm kiếm

      // Kiểm tra nếu từ khóa tìm kiếm có chứa ký tự "@"
      const containsAtSymbol = name.includes('@');

      listUser = listUser.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`;
        const userEmailWithoutTones = removeTones(user.email.toLowerCase());

        // Nếu từ khóa tìm kiếm có chứa "@" thì chỉ tìm kiếm trong email
        if (containsAtSymbol) {
          return userEmailWithoutTones.includes(nameWithoutTones);  // Tìm kiếm trong email
        }

        // Nếu không có "@" thì tìm kiếm trong tên
        return (
          removeTones(fullName.toLowerCase()).includes(nameWithoutTones) ||  // Tìm kiếm trong fullName
          removeTones(user.firstName.toLowerCase()).includes(nameWithoutTones) ||  // Tìm kiếm trong firstName
          removeTones(user.lastName.toLowerCase()).includes(nameWithoutTones)    // Tìm kiếm trong lastName
        );
      });
    }

    const listFriend = await getAllFriend(username);  // Lấy danh sách bạn bè

    // Trả về danh sách người dùng đã xáo trộn và danh sách bạn bè
    res.json({ listUser: shuffleArray(listUser), listFriend });
  } catch (error) {
    res.status(500).json(error);  // Xử lý lỗi nếu có
  }
});


const getUserDetail = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    const userDetail = await UserModel.findById(req.params.id, { password: 0 });
    if (userDetail) {
      const dateJoin =
        monthNames[userDetail?.createdAt.getMonth()] +
        " " +
        userDetail?.createdAt.getFullYear();
      const postCount = await PostModel.find({
        authorID: req.params.id,
      }).count();
      const listUpload = await ImageModel.find({
        userID: req.params.id,
      }).sort({
        createdAt: -1,
      });
      const listUserFriend = await FriendModel.find({
        $or: [
          {
            from: req.params.id,
          },
          { to: req.params.id },
        ],
        isConfirmed: true,
      }).populate(["from", "to"]);
      res.json({
        userInfo: {
          ...userDetail._doc,
          createdAt: dateJoin,
          listUpload,
          listUserFriend,
          chatID:
            username.email != userDetail.email &&
            (await ChatModel.findOne({
              participant: { $all: [username._id, req.params.id] },
            })),
        },
        listFriend: await getAllFriend(username),
        yourSelf: username.email == userDetail.email,
        postCount,
      });
    } else res.status(400).json("User is not valid");
  } catch (error) {
    res.status(500).json(error);
  }
});

const handleSearchHistory = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    const { searchHistory } = username;
    if (!searchHistory.includes(req.query.keyword.trim())) {
      await UserModel.findByIdAndUpdate(username._id, {
        searchHistory: [req.query.keyword.trim(), ...searchHistory],
      });
    } else {
      await UserModel.findByIdAndUpdate(username._id, {
        searchHistory: [
          req.query.keyword,
          ...searchHistory.filter((q) => q !== req.query.keyword.trim()),
        ],
      });
    }
    const userInfo = await UserModel.findById(username._id);
    res.json(userInfo.searchHistory);
  } catch (error) {
    res.status(500).json(error);
  }
});

const handleRemoveSearch = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    if (req.params.slug == "all") {
      await UserModel.findByIdAndUpdate(username._id, { searchHistory: [] });
    } else if (req.query.keyword) {
      await UserModel.findByIdAndUpdate(username._id, {
        searchHistory: username.searchHistory.filter(
          (q) => q !== req.query.keyword.trim()
        ),
      });
    } else res.status(400).json("Please type keyword to search");
    const userInfo = await UserModel.findById(username._id);
    res.json(userInfo.searchHistory);
  } catch (error) {
    res.status(500).json(error);
  }
});

const handleAccountStatusChange = asyncHandler(async (req, res) => {
    try {
    const { id } = req.params;
    const { isBan } = req.body;    
        
    if (req.username.role !== 1) {
      return res.status(403).json({ message: "Bạn không có quyền thay đổi trạng thái tài khoản" });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    user.isBan = isBan;
    await user.save();

    res.json({ message: "Cập nhật trạng thái tài khoản thành công", user });
  } catch (error) {
    console.log("Lỗi server: ", error);
    
    res.status(500).json({ message: "Lỗi server khi thay đổi trạng thái", error });
  }
});



const handleDeleteImage = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    const pictureInfo = await ImageModel.findOneAndDelete({
      _id: req.params.id,
      userID: username._id,
    });
    if (pictureInfo) {
      // const publicID = pictureInfo.link.split("/").pop().split(".")[0];
      // await cloudinary.destroy("twitter/" + publicID);
      res.json("Deleted successful image");
    } else res.status(400).json("Delete failed");
  } catch (error) {
    res.status(500).json(error);
  }
});

const handleUpdateInfo = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    const files = req.files;
    let newAvatar, newCoverImg;
    if (Object.keys(files).length > 0) {
      const { avatar, coverImg } = files;

      if (avatar) {
        const data = await cloudinary.upload(avatar[0].path, {
          folder: "twitter",
        });
        newAvatar = new ImageModel({
          name: data.original_filename,
          link: data.url,
          public_id: data.public_id,
          userID: username._id,
        });
        await newAvatar.save();
      }

      if (coverImg) {
        const data = await cloudinary.upload(coverImg[0].path, {
          folder: "twitter",
        });
        newCoverImg = new ImageModel({
          name: data.original_filename,
          link: data.url,
          public_id: data.public_id,
          userID: username._id,
        });
        await newCoverImg.save();
      }
    }

    await UserModel.findByIdAndUpdate(username._id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      avatar: newAvatar ? newAvatar.link : username.avatar,
      coverImg: newCoverImg ? newCoverImg.link : username.coverImg,
      detailInfo: {
        birthday: req.body.birthday === "dd/mm/yy" ? "" : req.body.birthday,
        workAt: req.body.workAt,
        desc: req.body.desc,
      },
    });
    const userInfo = await UserModel.findById(username._id);
    res.json(userInfo);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = {
  getUserList,
  getUserDetail,
  handleUpdateInfo,
  handleDeleteImage,
  handleSearchHistory,
  handleRemoveSearch,
  handleAccountStatusChange,
};
