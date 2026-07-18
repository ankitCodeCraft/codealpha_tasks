const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  createPost,
  getFeed,
  searchPosts,
  getSinglePost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} = require("../controllers/postController");


router.get("/", getFeed);

router.get("/search", searchPosts);

router.get("/:id", getSinglePost);

router.put("/:id", protect, upload.single("image"), updatePost);

// Create a new post
router.post("/", protect, upload.single("image"), createPost);

router.delete("/:id", protect, deletePost);

router.put("/:id/like", protect, likePost);

router.put("/:id/unlike", protect, unlikePost);


module.exports = router;
