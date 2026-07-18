const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");

// Get Notifications
const getNotifications = asyncHandler(async (req, res) => {
  // Pagination
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

  const skip = (page - 1) * limit;

  // Total Notifications
  const totalResults = await Notification.countDocuments({
    receiver: req.user._id,
  });

  // Fetch Notifications
  const notifications = await Notification.find({
    receiver: req.user._id,
  })
    .populate("sender", "name username profilePhoto")
    .populate("post", "caption image")
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
    count: notifications.length,
    data: notifications,
  });
});

module.exports = {
  getNotifications,
};
