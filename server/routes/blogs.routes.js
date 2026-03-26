const express = require("express");
const router = express.Router();

const {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  deleteManyBlogs,
} = require("../controllers/blogs.controller");

const { protect } = require("../middlewares/auth.middleware");

// Public
router.get("/", getAllBlogs);

// Protected
router.post("/", protect, createBlog);
router.delete("/bulk", protect, deleteManyBlogs);
router.patch("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

// Slug route (MUST BE LAST)
router.get("/:slug", getBlogBySlug);

module.exports = router;
