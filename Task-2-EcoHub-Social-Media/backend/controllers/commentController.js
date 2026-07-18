const Comment = require("../models/Comment");
const Post = require("../models/Post");
const asyncHandler = require("../utils/asyncHandler");

// Add Comment
const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  if (!comment || comment.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Comment cannot be empty.",
    });
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }

  const newComment = await Comment.create({
    user: req.user._id,
    post: post._id,
    comment,
  });

  post.commentsCount += 1;
  await post.save();

  const populatedComment = await Comment.findById(newComment._id).populate(
    "user",
    "name username profilePhoto",
  );

  res.status(201).json({
    success: true,
    message: "Comment added successfully.",
    data: populatedComment,
  });
});

// Get Comments of a Post
const getComments = asyncHandler(async (req, res) => {
  // Pagination
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

  const skip = (page - 1) * limit;

  // Total Comments
  const totalResults = await Comment.countDocuments({
    post: req.params.id,
  });

  // Fetch Comments
  const comments = await Comment.find({
    post: req.params.id,
  })
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
    count: comments.length,
    data: comments,
  });
});

// Delete Comment
const deleteComment = asyncHandler(async (req, res) => {

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
        return res.status(404).json({
            success: false,
            message: "Comment not found."
        });
    }

    // Owner or Admin
    if (
        comment.user.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
    ) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to delete this comment."
        });
    }

    const post = await Post.findById(comment.post);

    if (post && post.commentsCount > 0) {
        post.commentsCount -= 1;
        await post.save();
    }

    await comment.deleteOne();

    res.status(200).json({
        success: true,
        message: "Comment deleted successfully."
    });

});

module.exports = {
  addComment,
  getComments,
  deleteComment,
};
