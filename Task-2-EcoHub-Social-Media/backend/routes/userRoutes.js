const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  followUser,
  unfollowUser,
  searchUsers,
  getMyProfile,
  getUserProfile,
  updateProfile,
} = require("../controllers/userController");

// Search Users
router.get("/search", protect, searchUsers);

router.get("/profile", protect, getMyProfile);

// Update Logged-in User Profile
router.put("/profile", protect, upload.single("profilePhoto"), updateProfile);

router.get("/:id", protect, getUserProfile);

// Follow User
router.put("/:id/follow", protect, followUser);

// Unfollow User
router.put("/:id/unfollow", protect, unfollowUser);

module.exports = router;
