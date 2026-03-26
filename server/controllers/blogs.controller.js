// controllers/blog.controller.js

const asyncHandler = require("express-async-handler");
const Blog = require("../models/blogs");
const ApiResponse = require("../utils/ApiResponse.utils");

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ============================================
// GET ALL BLOGS (Public)
// ============================================
exports.getAllBlogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = "-publishedAt",
    category,
    tag,
    isFeatured,
    search,
  } = req.query;

  let filter = { status: "published" };

  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (isFeatured) filter.isFeatured = isFeatured === "true";

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    filter.$or = [
      { title: searchRegex },
      { excerpt: searchRegex },
      { tags: searchRegex },
    ];
  }

  const [blogs, count] = await Promise.all([
    Blog.find(filter)
      .sort(sort)
      .limit(parseInt(limit, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
      .populate("featuredModels", "firstName lastName slug photos"),
    Blog.countDocuments(filter),
  ]);

  new ApiResponse(true, "Blogs fetched successfully", blogs, 200, {
    count: blogs.length,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page, 10),
    total: count,
  }).send(res);
});

// ============================================
// GET SINGLE BLOG BY SLUG (Public)
// ============================================
exports.getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({
    slug: req.params.slug,
    status: "published",
  }).populate("featuredModels", "firstName lastName slug photos");

  if (!blog) {
    return new ApiResponse(false, "Blog not found", null, 404).send(res);
  }

  // Increment views
  blog.views += 1;
  await blog.save();

  new ApiResponse(true, "Blog fetched successfully", blog).send(res);
});

// ============================================
// CREATE BLOG (Protected)
// ============================================
exports.createBlog = asyncHandler(async (req, res) => {
  const { title, excerpt, content, category } = req.body;

  if (!title || !excerpt || !content || !category) {
    return new ApiResponse(
      false,
      "title, excerpt, content, and category are required",
      null,
      400,
    ).send(res);
  }

  // Auto-generate slug
  let slug =
    req.body.slug ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Handle duplicate slug
  let slugExists = await Blog.findOne({ slug });
  let counter = 1;
  const originalSlug = slug;

  while (slugExists) {
    slug = `${originalSlug}-${counter}`;
    slugExists = await Blog.findOne({ slug });
    counter++;
  }

  const blogData = { ...req.body, slug };

  // Set publishedAt if publishing
  if (blogData.status === "published" && !blogData.publishedAt) {
    blogData.publishedAt = new Date();
  }

  // Auto-generate meta
  if (!blogData.metaTitle) blogData.metaTitle = title;
  if (!blogData.metaDescription) blogData.metaDescription = excerpt;

  const blog = await Blog.create(blogData);

  new ApiResponse(true, "Blog created successfully", blog, 201).send(res);
});

// ============================================
// UPDATE BLOG (Protected)
// ============================================
exports.updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check slug uniqueness
  if (req.body.slug) {
    const existing = await Blog.findOne({
      slug: req.body.slug,
      _id: { $ne: id },
    });
    if (existing) {
      return new ApiResponse(false, "Slug already taken", null, 400).send(res);
    }
  }

  // Set publishedAt if publishing for first time
  if (req.body.status === "published") {
    const currentBlog = await Blog.findById(id);
    if (currentBlog && currentBlog.status !== "published") {
      req.body.publishedAt = new Date();
    }
  }

  const blog = await Blog.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    return new ApiResponse(false, "Blog not found", null, 404).send(res);
  }

  new ApiResponse(true, "Blog updated successfully", blog).send(res);
});

// ============================================
// DELETE BLOG (Protected)
// ============================================
exports.deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    return new ApiResponse(false, "Blog not found", null, 404).send(res);
  }

  new ApiResponse(true, "Blog deleted successfully").send(res);
});

// ============================================
// DELETE MANY BLOGS (Protected)
// ============================================

exports.deleteManyBlogs = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return new ApiResponse(false, "ids array is required", null, 400).send(res);
  }

  const result = await Blog.deleteMany({
    _id: { $in: ids },
  });

  new ApiResponse(true, `${result.deletedCount} blogs deleted successfully`, {
    deletedCount: result.deletedCount,
  }).send(res);
});
