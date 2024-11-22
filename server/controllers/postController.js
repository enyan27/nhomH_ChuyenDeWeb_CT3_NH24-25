const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cloudinary");
const CommentModel = require("../models/CommentModel");
const ImageModel = require("../models/ImageModel");
const NotifyModel = require("../models/NotifyModel");
const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const removeTones = require("../utils/removeTones");

async function checkSavedAndLiked(listPost, username) {
  const { listSaved, _id } = username;
  const listNewPost = listPost.map(async (post) => {
    const isRetweeted = await PostModel.exists({ retweetPost: post._id, authorID: _id });
    return {
      ...(post._doc || post),
      saved: listSaved.includes(post._id),
      isLiked: post.listHeart.includes(_id),
      isRetweeted,
      commentCount: await CommentModel.find({ postID: post._id }).count(),
      retweetCount: await PostModel.find({ retweetPost: post._id }).count(),
    };
  });
  return await Promise.all(listNewPost);
}

function searchListByContent(str, content) {
  return removeTones(str.toLowerCase()).includes(
    removeTones(content.toLowerCase())
  );
}

// OK
const getPostList = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    let listPost = await PostModel.find({})
      .populate("authorID", ["_id", "email", "firstName", "lastName", "avatar"])
      .populate({
        path: "retweetPost",
        populate: { path: "authorID", select: ["_id", "firstName", "lastName", "avatar"] },
      });

    const { keyword, by } = req.query;
    if (keyword) {
      listPost = listPost.filter((post) =>
        searchListByContent(post.content, keyword)
      );
    }

    listPost = await checkSavedAndLiked(listPost, username);

    if (by === "saved") {
      listPost = listPost.filter((post) => post.saved);
    } else if (by === "like") {
      listPost = listPost.sort((a, b) => b.listHeart.length - a.listHeart.length);
    } else if (by === "comment") {
      listPost = listPost.sort((a, b) => b.commentCount - a.commentCount);
    } else {
      listPost = listPost.sort((a, b) => b.createdAt - a.createdAt);
    }

    res.json({ listPost });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});

// OK
const getPostPersonal = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    const { id } = req.params;
    const userInfo = await UserModel.findById(id);
    let postDetail = await PostModel.findById(id).populate("authorID", [
      "_id",
      "email",
      "firstName",
      "lastName",
      "avatar",
    ]);

    if (userInfo) {
      const { by } = req.query;
      let condition = {};

      if (by === "liked") {
        condition = { listHeart: id };
      } else if (by !== "saved") {
        condition = { authorID: id };
      }

      let listPost = await PostModel.find(condition)
        .populate("authorID", ["_id", "email", "firstName", "lastName", "avatar"])
        .populate({
          path: "retweetPost",
          populate: { path: "authorID", select: ["_id", "firstName", "lastName", "avatar"] },
        })
        .sort({ createdAt: -1 });

      listPost = await checkSavedAndLiked(listPost, username);

      if (by === "saved") {
        listPost = listPost.filter((post) => post.saved);
      } else if (by === "liked") {
        listPost = listPost.filter((post) => post.isLiked);
      }

      res.json({ listPost });
    } else if (postDetail) {
      postDetail = (await checkSavedAndLiked([postDetail], username))[0];
      res.json(postDetail);
    } else res.status(400).json("User invalid");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});

const handleModeComment = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    const postInfo = await PostModel.findOne({
      _id: req.params.id,
      authorID: username._id,
    });
    if (postInfo) {
      await PostModel.findByIdAndUpdate(postInfo._id, {
        modeComment: !postInfo.modeComment,
      });
      res.json("Turn on/off mode comment");
    } else res.status(400).json("Catch error");
  } catch (error) {
    res.status(500).json(error);
  }
});

const handleCreatePost = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    const { type } = req.body;
    let newPost;
    if (type === "theme") {
      newPost = await PostModel.create({
        ...req.body,
        authorID: username._id,
        theme: req.body.theme || { linkImg: null },
      });
    } else if (type === "image") {
      const files = req.files.publicImg;
      var listImg = [];
      if (files && files.length > 0) {
        for (const file of files) {
          const data = await cloudinary.upload(file.path, {
            folder: "twitter",
          });
          await ImageModel.create({
            name: data.original_filename,
            link: data.url,
            userID: username._id,
          });
          listImg.push(data.url);
        }
      }
      newPost = await PostModel.create({
        ...req.body,
        authorID: username._id,
        listImg,
      });
    } else if (type === "video") {
      const file = req.files.videoUpload[0];
      const data = await cloudinary.upload(file.path, {
        folder: "twitter",
        resource_type: "video",
      });
      newPost = await PostModel.create({
        ...req.body,
        authorID: username._id,
        linkVideo: data.url,
      });
      res.json(newPost);
    } else res.status(400).json("Invalid post type");
    // Fix - Get new post
    const postWithAuthorInfo = await PostModel.findById(newPost._id).populate("authorID", [
      "_id",
      "firstName",
      "lastName",
      "avatar",
    ]);
    res.json(postWithAuthorInfo);
  } catch (error) {
    res.status(500).json({ error, mess: "Error server" });
  }
});

const handleShowHeart = asyncHandler(async (req, res) => {
  try {
    const username = req.username;
    const postInfo = await PostModel.findById(req.params.id);
    if (!postInfo) res.status(400).json("Id post is invalid");
    else {
      let listHeart = postInfo.listHeart;
      const userIndex = listHeart.indexOf(username._id);
      userIndex === -1
        ? listHeart.push(username._id)
        : listHeart.splice(userIndex, 1);
      await PostModel.findByIdAndUpdate(req.params.id, {
        listHeart,
      });
      res.json({ postInfo });
    }
  } catch (error) {
    res.status(500).json("Server error");
  }
});

const handleSavePost = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    const postInfo = await PostModel.findById(req.params.id);
    if (!postInfo) res.status(400).json("Id post is invalid");
    else {
      let listSaved = username.listSaved;
      const postIndex = listSaved.indexOf(req.params.id);
      postIndex === -1
        ? listSaved.push(req.params.id)
        : listSaved.splice(postIndex, 1);
      await UserModel.findByIdAndUpdate(username._id, {
        listSaved,
      });
      res.json("Saved success");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

const handleDeletePost = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    const postInfo = await PostModel.findOneAndDelete({
      _id: req.params.id,
      authorID: username._id,
    });
    if (postInfo) {
      await CommentModel.deleteMany({
        postID: req.params.id,
      });
      await NotifyModel.deleteOne({
        postID: req.params.id,
      });
      const listUserSavedPost = await UserModel.find({
        listSaved: req.params.id,
      });
      for (const user of listUserSavedPost) {
        await UserModel.findByIdAndUpdate(user._id, {
          listSaved: user.listSaved.filter((postID) => postID != req.params.id),
        });
      }
      if (postInfo.type === "video") {
        const publicID = postInfo.linkVideo.split("/").pop().split(".")[0];
        await cloudinary.destroy("twitter/" + publicID);
      }
      res.json("Delete success");
    } else res.status(400).json("Catch error");
  } catch (error) {
    res.status(500).json("Server error");
  }
});

const handleRetweetPost = asyncHandler(async (req, res) => {
  const username = req.username;
  try {
    const { content, retweetPostID } = req.body;

    const originalPost = await PostModel.findById(retweetPostID).populate("authorID", [
      "_id",
      "email",
      "firstName",
      "lastName",
      "avatar",
    ]);

    if (!originalPost) {
      return res.status(404).json({ message: "Original post not found" });
    }

    const newRetweet = await PostModel.create({
      content,
      type: "retweet",
      authorID: username._id,
      retweetPost: originalPost._id,
    });

    const retweetWithDetails = await PostModel.findById(newRetweet._id)
      .populate("authorID", ["_id", "firstName", "lastName", "avatar"])
      .populate({
        path: "retweetPost",
        populate: { path: "authorID", select: ["_id", "firstName", "lastName", "avatar"] },
      });

    const retweetCount = await PostModel.find({ retweetPost: retweetPostID }).count();

    res.status(201).json({ ...retweetWithDetails._doc, retweetCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error, message: "Server error" });
  }
});

module.exports = {
  getPostList,
  getPostPersonal,
  handleCreatePost,
  handleModeComment,
  handleDeletePost,
  handleShowHeart,
  handleSavePost,
  handleRetweetPost,
};
