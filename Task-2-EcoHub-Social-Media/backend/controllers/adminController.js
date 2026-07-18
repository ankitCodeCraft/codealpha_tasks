const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");

// Dashboard Statistics
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();

  const totalPosts = await Post.countDocuments();

  const totalComments = await Comment.countDocuments();

  const totalNotifications = await Notification.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalPosts,
      totalComments,
      totalNotifications,
    },
  });
});

module.exports = {
  getDashboardStats,
};
