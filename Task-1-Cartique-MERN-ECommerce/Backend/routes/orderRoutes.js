const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  markOrderDelivered,
  markOrderPaid,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/deliver", protect, admin, markOrderDelivered);
router.put("/:id/pay", protect, admin, markOrderPaid);

module.exports = router;
