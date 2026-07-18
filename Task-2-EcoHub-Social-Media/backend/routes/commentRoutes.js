const express = require("express");
const router = express.Router({ mergeParams: true });

const { protect } = require("../middleware/authMiddleware");
const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");


router.get("/", getComments);

router.post("/", protect, addComment);

router.delete("/:commentId", protect, deleteComment);

module.exports = router;
