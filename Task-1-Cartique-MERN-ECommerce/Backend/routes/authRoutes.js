const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUsers,
  getUserProfile,
  updateUserProfile,
  addAddress,
  setDefaultAddress,
  deleteAddress,
  deleteUser,
  toggleAdmin,
  getDashboardStats,
} = require("../controllers/authController");

const { protect, admin } = require("../middleware/authMiddleware");

// Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

// User Profile
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

  router.post("/address", protect, addAddress);

  router.put("/address/:id/default", protect, setDefaultAddress);

  router.delete("/address/:id", protect, deleteAddress);

// Admin Routes
router.get("/users", protect, admin, getUsers);

router.get("/dashboard", protect, admin, getDashboardStats);

router.delete("/users/:id", protect, admin, deleteUser);

router.put("/users/:id/admin", protect, admin, toggleAdmin);

module.exports = router;
