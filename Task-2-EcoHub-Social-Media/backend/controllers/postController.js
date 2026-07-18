const Post = require("../models/Post");

const asyncHandler = require("../utils/asyncHandler");

const fs = require("fs");
const path = require("path");

// Create Post
// Create Post
const createPost = asyncHandler(async (req, res) => {
    const { caption } = req.body;

    // Check if image is uploaded
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Please upload an image."
        });
    }

    const post = await Post.create({
      user: req.user._id,
      caption,
      image: `/uploads/${req.file.filename}`,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "user",
      "name username profilePhoto",
    );

    res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: populatedPost,
    });
});

// Get All Posts (Feed)
const getFeed = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  // Filter query
  const queryFilter = {};
  if (req.query.user) {
    queryFilter.user = req.query.user;
  }

  // Total Posts
  const totalResults = await Post.countDocuments(queryFilter);

  // Fetch Posts
  const posts = await Post.find(queryFilter)
    .populate("user", "name username profilePhoto")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Total Pages
  const totalPages = Math.ceil(totalResults / limit);

  res.status(200).json({
    success: true,
    page,
    limit,
    totalPages,
    totalResults,
    count: posts.length,
    data: posts,
  });
});

// Search Posts
const searchPosts = asyncHandler(async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query is required.",
    });
  }

  // Pagination
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

  const skip = (page - 1) * limit;

  // Search Filter
  const searchFilter = {
    caption: {
      $regex: query,
      $options: "i",
    },
  };

  // Total Results
  const totalResults = await Post.countDocuments(searchFilter);

  // Fetch Posts
  const posts = await Post.find(searchFilter)
    .populate("user", "name username profilePhoto")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Total Pages
  const totalPages = Math.ceil(totalResults / limit);

  res.status(200).json({
    success: true,
    page,
    limit,
    totalPages,
    totalResults,
    count: posts.length,
    data: posts,
  });
});

// Get Single Post
const getSinglePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate("user", "name username profilePhoto");

    if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found."
        });
    }

    res.status(200).json({
        success: true,
        data: post
    });
});

// Edit Post
const updatePost = asyncHandler(async (req, res) => {
    const { caption } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found."
        });
    }

    // Owner or Admin
    if (
        post.user.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
    ) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to edit this post."
        });
    }

    if (caption !== undefined) {
        post.caption = caption;
    }

    // Replace Image
    if (req.file) {

        if (post.image) {

            const oldImage = path.join(
                __dirname,
                "..",
                post.image
            );

            if (fs.existsSync(oldImage)) {
                fs.unlinkSync(oldImage);
            }
        }

        post.image = `/uploads/${req.file.filename}`;
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
        .populate("user", "name username profilePhoto");

    res.status(200).json({
        success: true,
        message: "Post updated successfully.",
        data: updatedPost
    });
});

// Delete Post
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found."
        });
    }

    // Owner or Admin
    if (
        post.user.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
    ) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to delete this post."
        });
    }

    // Delete image
    if (post.image) {
        const imagePath = path.join(__dirname, "..", post.image);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    await post.deleteOne();

    res.status(200).json({
        success: true,
        message: "Post deleted successfully."
    });
});

// Like Post
const likePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found."
        });
    }

    // Check if already liked
    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
        return res.status(400).json({
            success: false,
            message: "You already liked this post."
        });
    }

    post.likes.push(req.user._id);

    await post.save();

    const updatedPost = await Post.findById(post._id)
        .populate("user", "name username profilePhoto");

    res.status(200).json({
        success: true,
        message: "Post liked successfully.",
        data: updatedPost
    });
});

// Unlike Post
const unlikePost = asyncHandler(async (req, res) => {

    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found."
        });
    }

    const alreadyLiked = post.likes.some(
        (id) => id.toString() === req.user._id.toString()
    );

    if (!alreadyLiked) {
        return res.status(400).json({
            success: false,
            message: "You have not liked this post."
        });
    }

    post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
    );

    await post.save();

    const updatedPost = await Post.findById(post._id)
        .populate("user", "name username profilePhoto");

    res.status(200).json({
        success: true,
        message: "Post unliked successfully.",
        data: updatedPost
    });

});

module.exports = {
  createPost,
  getFeed,
  searchPosts,
  getSinglePost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
};