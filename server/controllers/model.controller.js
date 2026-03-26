// controllers/modelController.js
const asyncHandler = require("express-async-handler");
const Model = require("../models/model");
const ApiResponse = require("../utils/ApiResponse.utils");

// Helper: Escape regex special characters
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ============================================
// GET ALL MODELS (With Search & All Filters)
// ============================================
exports.getAllModels = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = "-createdAt",
    division,
    category,
    gender,
    experience,
    isFeatured,
    isNewFace,
    search, // General search (searches multiple fields)
    query, // Name search only (kept for backward compatibility)
    minHeight,
    maxHeight,
    minAge,
    maxAge,
    hairColor,
    eyeColor,
    ethnicity,
    location, // Search by location
    skill, // Search by special skill
    client, // Search by client worked with
  } = req.query;

  // Build filter
  let filterQuery = { status: "active" };

  // ============================================
  // BASIC FILTERS
  // ============================================
  if (division) filterQuery.division = division;
  if (category) filterQuery.categories = category;
  if (gender) filterQuery.gender = gender;
  if (experience) filterQuery.experience = experience;
  if (isFeatured) filterQuery.isFeatured = isFeatured === "true";
  if (isNewFace) filterQuery.isNewFace = isNewFace === "true";

  // ============================================
  // SEARCH FILTERS
  // ============================================

  // General Search (searches across multiple fields)
  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    filterQuery.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { slug: searchRegex },
      { ethnicity: searchRegex },
      { "location.based": searchRegex },
      { "portfolio.clients": searchRegex },
      { "features.specialSkills": searchRegex },
      { keywords: searchRegex },
      { metaTitle: searchRegex },
    ];
  }

  // Name-only search (backward compatible)
  if (query && !search) {
    const queryRegex = new RegExp(escapeRegex(query), "i");
    filterQuery.$or = [{ firstName: queryRegex }, { lastName: queryRegex }];
  }

  // ============================================
  // ATTRIBUTE FILTERS
  // ============================================

  // Hair color
  if (hairColor) {
    filterQuery["stats.hairColor"] = new RegExp(escapeRegex(hairColor), "i");
  }

  // Eye color
  if (eyeColor) {
    filterQuery["stats.eyeColor"] = new RegExp(escapeRegex(eyeColor), "i");
  }

  // Ethnicity
  if (ethnicity) {
    filterQuery.ethnicity = new RegExp(escapeRegex(ethnicity), "i");
  }

  // Location based
  if (location) {
    filterQuery.$or = [
      { "location.based": new RegExp(escapeRegex(location), "i") },
      { "location.available": new RegExp(escapeRegex(location), "i") },
    ];
  }

  // Special skill
  if (skill) {
    filterQuery["features.specialSkills"] = new RegExp(escapeRegex(skill), "i");
  }

  // Client worked with
  if (client) {
    filterQuery["portfolio.clients"] = new RegExp(escapeRegex(client), "i");
  }

  // ============================================
  // RANGE FILTERS
  // ============================================

  // Height range
  if (minHeight || maxHeight) {
    filterQuery["stats.height.cm"] = {};
    if (minHeight)
      filterQuery["stats.height.cm"].$gte = parseInt(minHeight, 10);
    if (maxHeight)
      filterQuery["stats.height.cm"].$lte = parseInt(maxHeight, 10);
  }

  // Age range
  if (minAge || maxAge) {
    filterQuery.age = {};
    if (minAge) filterQuery.age.$gte = parseInt(minAge, 10);
    if (maxAge) filterQuery.age.$lte = parseInt(maxAge, 10);
  }

  // ============================================
  // EXECUTE QUERY
  // ============================================
  const [models, count] = await Promise.all([
    Model.find(filterQuery)
      .sort(sort)
      .limit(parseInt(limit, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10)),
    Model.countDocuments(filterQuery),
  ]);

  new ApiResponse(true, "Models fetched successfully", models, 200, {
    count: models.length,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page, 10),
    total: count,
  }).send(res);
});

// controllers/model.controller.js

exports.getModelById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId format
  const mongoose = require('mongoose');
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new ApiResponse(false, "Invalid model ID format", null, 400).send(res);
  }

  const model = await Model.findById(id);

  if (!model) {
    return new ApiResponse(false, "Model not found", null, 404).send(res);
  }

  new ApiResponse(true, "Model fetched successfully", model).send(res);
});

// ============================================
// SEARCH MODELS (Dedicated Search Endpoint)
// ============================================
exports.searchModels = asyncHandler(async (req, res) => {
  const {
    q, // Search query (required)
    page = 1,
    limit = 20,
    sort = "-createdAt",
    division,
    category,
    gender,
  } = req.query;

  // Validation
  if (!q || q.trim() === "") {
    return new ApiResponse(
      false,
      "Search query 'q' is required",
      null,
      400,
    ).send(res);
  }

  const searchRegex = new RegExp(escapeRegex(q.trim()), "i");

  // Build filter
  let filterQuery = {
    status: "active",
    $or: [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { slug: searchRegex },
      { ethnicity: searchRegex },
      { "location.based": searchRegex },
      { "location.available": searchRegex },
      { "portfolio.clients": searchRegex },
      { "portfolio.editorials": searchRegex },
      { "portfolio.campaigns": searchRegex },
      { "features.specialSkills": searchRegex },
      { keywords: searchRegex },
      { metaTitle: searchRegex },
      { metaDescription: searchRegex },
      { "stats.hairColor": searchRegex },
      { "stats.eyeColor": searchRegex },
    ],
  };

  // Additional filters
  if (division) filterQuery.division = division;
  if (category) filterQuery.categories = category;
  if (gender) filterQuery.gender = gender;

  // Execute query
  const [models, count] = await Promise.all([
    Model.find(filterQuery)
      .sort(sort)
      .limit(parseInt(limit, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10)),
    Model.countDocuments(filterQuery),
  ]);

  new ApiResponse(true, `Found ${count} results for "${q}"`, models, 200, {
    query: q,
    count: models.length,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page, 10),
    total: count,
  }).send(res);
});

// ============================================
// GET SINGLE MODEL BY SLUG
// ============================================
exports.getModelBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const model = await Model.findOne({ slug, status: "active" });

  if (!model) {
    return new ApiResponse(false, "Model not found", null, 404).send(res);
  }

  new ApiResponse(true, "Model fetched successfully", model).send(res);
});

// ============================================
// CREATE MODEL
// ============================================
exports.createModel = asyncHandler(async (req, res) => {
  const { firstName, lastName, division, categories } = req.body;

  // Validation
  if (!firstName || !lastName || !division || !categories) {
    return new ApiResponse(
      false,
      "firstName, lastName, division, and categories are required",
      null,
      400,
    ).send(res);
  }

  // Auto-generate slug
  let slug = req.body.slug;
  if (!slug) {
    slug = `${firstName}-${lastName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Check if slug exists
  const existingModel = await Model.findOne({ slug });
  if (existingModel) {
    return new ApiResponse(
      false,
      `Model with slug "${slug}" already exists`,
      null,
      400,
    ).send(res);
  }

  // Create model
  const model = await Model.create({
    ...req.body,
    slug,
    status: "active",
  });

  new ApiResponse(true, "Model created successfully", model, 201).send(res);
});

// ============================================
// UPDATE MODEL
// ============================================
exports.updateModel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check slug uniqueness
  if (req.body.slug) {
    const existing = await Model.findOne({
      slug: req.body.slug,
      _id: { $ne: id },
    });
    if (existing) {
      return new ApiResponse(
        false,
        "Slug already taken by another model",
        null,
        400,
      ).send(res);
    }
  }

  const model = await Model.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!model) {
    return new ApiResponse(false, "Model not found", null, 404).send(res);
  }

  new ApiResponse(true, "Model updated successfully", model).send(res);
});

// ============================================
// DELETE MODEL
// ============================================
exports.deleteModel = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const model = await Model.findByIdAndDelete(id);

  if (!model) {
    return new ApiResponse(false, "Model not found", null, 404).send(res);
  }

  new ApiResponse(true, "Model deleted successfully").send(res);
});
