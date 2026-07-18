const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const createNotification = require("../utils/createNotification");
const path = require("path");
const fs = require("fs");
const Post = require("../models/Post");

// Follow User
const followUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    return res.status(400).json({
      success: false,
      message: "You cannot follow yourself.",
    });
  }

  const currentUser = await User.findById(req.user._id);
  const targetUser = await User.findById(req.params.id);

  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const alreadyFollowing = currentUser.following.some(
    (id) => id.toString() === targetUser._id.toString(),
  );

  if (alreadyFollowing) {
    return res.status(400).json({
      success: false,
      message: "You are already following this user.",
    });
  }

  currentUser.following.push(targetUser._id);
  targetUser.followers.push(currentUser._id);

  await currentUser.save();
  await targetUser.save();

  await createNotification(targetUser._id, currentUser._id, "follow");

  res.status(200).json({
    success: true,
    message: `You are now following ${targetUser.username}.`,
  });
});

// Unfollow User
const unfollowUser = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  const targetUser = await User.findById(req.params.id);

  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const isFollowing = currentUser.following.some(
    (id) => id.toString() === targetUser._id.toString(),
  );

  if (!isFollowing) {
    return res.status(400).json({
      success: false,
      message: "You are not following this user.",
    });
  }

  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== targetUser._id.toString(),
  );

  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== currentUser._id.toString(),
  );

  await currentUser.save();
  await targetUser.save();

  res.status(200).json({
    success: true,
    message: `You unfollowed ${targetUser.username}.`,
  });
});

// Search Users
const searchUsers = asyncHandler(async (req, res) => {
  const query = req.query.q;

  // Pagination
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

  const skip = (page - 1) * limit;

  // Search Filter - match query if present, otherwise return all users
  const searchFilter = query
    ? {
        $or: [
          {
            name: {
              $regex: query,
              $options: "i",
            },
          },
          {
            username: {
              $regex: query,
              $options: "i",
            },
          },
        ],
      }
    : {};

  // Total Results
  const totalResults = await User.countDocuments(searchFilter);

  // Fetch Users
  const users = await User.find(searchFilter)
    .select("-password")
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
    count: users.length,
    data: users,
  });
});

// Get Logged-in User Profile
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("followers", "name username profilePhoto")
    .populate("following", "name username profilePhoto");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get Public User Profile
const getUserProfile = asyncHandler(async (req, res) => {

  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers", "name username profilePhoto")
    .populate("following", "name username profilePhoto");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const postsCount = await Post.countDocuments({
    user: user._id,
  });

  const followersCount = user.followers.length;
  const followingCount = user.following.length;

  const isFollowing = req.user.following.some(
    (id) => id.toString() === user._id.toString()
  );

  res.status(200).json({
    success: true,
    data: {
      user,
      postsCount,
      followersCount,
      followingCount,
      isFollowing,
    },
  });

});

// Update Profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const { name, bio, location, website } = req.body;

  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (location !== undefined) user.location = location;
  if (website !== undefined) user.website = website;

  if (req.file) {
    if (user.profilePhoto) {
      const oldPath = path.join(__dirname, "..", user.profilePhoto);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    user.profilePhoto = `/uploads/${req.file.filename}`;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: user,
  });
});

module.exports = {
  followUser,
  unfollowUser,
  searchUsers,
  getMyProfile,
  getUserProfile,
  updateProfile,
};
