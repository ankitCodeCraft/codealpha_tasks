const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const { getDashboardStats } = require("../controllers/adminController");

router.get("/dashboard", protect, adminOnly, getDashboardStats);

module.exports = router;
