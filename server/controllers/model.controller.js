// controllers/modelController.js
const Model = require("../models/model");

// ============================================
// GET ALL MODELS
// ============================================

exports.getAllModels = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = "-createdAt" } = req.query;

    const models = await Model.find({ status: "active" })
      .select(
        "firstName lastName slug division categories photos.url photos.isPrimary stats",
      )
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Model.countDocuments({ status: "active" });

    res.json({
      success: true,
      count: models.length,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
      data: models,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch models",
      error: error.message,
    });
  }
};

// ============================================
// GET MODELS BY DIVISION
// ============================================
exports.getModelsByDivision = async (req, res) => {
  try {
    const { division } = req.params;
    const { page = 1, limit = 20, sort = "-createdAt" } = req.query;

    // Validate division
    const validDivisions = [
      "women",
      "men",
      "newFaces",
      "direct",
      "special-booking",
      "juniors",
    ];

    if (!validDivisions.includes(division)) {
      return res.status(400).json({
        success: false,
        message: `Invalid division. Valid divisions are: ${validDivisions.join(", ")}`,
      });
    }

    const models = await Model.find({
      division,
      status: "active",
    })
      .select("firstName lastName slug division categories photos stats")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Model.countDocuments({ division, status: "active" });

    res.json({
      success: true,
      division,
      count: models.length,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
      data: models,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch models",
      error: error.message,
    });
  }
};

// ============================================
// GET MODELS BY CATEGORY
// ============================================
exports.getModelsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20, sort = "-createdAt" } = req.query;

    // Validate category
    const validCategories = [
      "main-board",
      "new-faces",
      "direct",
      "classic",
      "girls",
      "boys",
      "family",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Valid categories are: ${validCategories.join(", ")}`,
      });
    }

    const models = await Model.find({
      categories: category,
      status: "active",
    })
      .select("firstName lastName slug division categories photos stats")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Model.countDocuments({
      categories: category,
      status: "active",
    });

    res.json({
      success: true,
      category,
      count: models.length,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
      data: models,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch models",
      error: error.message,
    });
  }
};

// ============================================
// GET MODELS BY DIVISION AND CATEGORY
// ============================================
exports.getModelsByDivisionAndCategory = async (req, res) => {
  try {
    const { division, category } = req.params;
    const { page = 1, limit = 20, sort = "-createdAt" } = req.query;

    const models = await Model.find({
      division,
      categories: category,
      status: "active",
    })
      .select("firstName lastName slug division categories photos stats")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Model.countDocuments({
      division,
      categories: category,
      status: "active",
    });

    res.json({
      success: true,
      division,
      category,
      count: models.length,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
      data: models,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch models",
      error: error.message,
    });
  }
};

// ============================================
// GET SINGLE MODEL BY SLUG
// ============================================
exports.getModelBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const model = await Model.findOne({ slug, status: "active" });

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    res.json({
      success: true,
      data: model,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch model",
      error: error.message,
    });
  }
};

// ============================================
// GET FEATURED MODELS
// ============================================
exports.getFeaturedModels = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const models = await Model.find({
      status: "active",
      isFeatured: true,
    })
      .select("firstName lastName slug division categories photos stats")
      .sort("-createdAt")
      .limit(limit * 1);

    res.json({
      success: true,
      count: models.length,
      data: models,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured models",
      error: error.message,
    });
  }
};

// ============================================
// GET NEW FACES
// ============================================
exports.getNewFaces = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;

    const models = await Model.find({
      status: "active",
      $or: [
        { isNewFace: true },
        { division: "newFaces" },
        { categories: "new-faces" },
      ],
    })
      .select("firstName lastName slug division categories photos stats")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Model.countDocuments({
      status: "active",
      $or: [
        { isNewFace: true },
        { division: "newFaces" },
        { categories: "new-faces" },
      ],
    });

    res.json({
      success: true,
      count: models.length,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
      data: models,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch new faces",
      error: error.message,
    });
  }
};

// ============================================
// SEARCH MODELS
// ============================================
exports.searchModels = async (req, res) => {
  try {
    const {
      query,
      division,
      category,
      gender,
      minHeight,
      maxHeight,
      hairColor,
      eyeColor,
      page = 1,
      limit = 20,
    } = req.query;

    let searchQuery = { status: "active" };

    // Text search on name
    if (query) {
      searchQuery.$or = [
        { firstName: new RegExp(query, "i") },
        { lastName: new RegExp(query, "i") },
      ];
    }

    // Filter by division
    if (division) {
      searchQuery.division = division;
    }

    // Filter by category
    if (category) {
      searchQuery.categories = category;
    }

    // Filter by gender
    if (gender) {
      searchQuery.gender = gender;
    }

    // Filter by hair color
    if (hairColor) {
      searchQuery["stats.hairColor"] = new RegExp(hairColor, "i");
    }

    // Filter by eye color
    if (eyeColor) {
      searchQuery["stats.eyeColor"] = new RegExp(eyeColor, "i");
    }

    // Height range filter
    if (minHeight || maxHeight) {
      searchQuery["stats.height.cm"] = {};
      if (minHeight) searchQuery["stats.height.cm"].$gte = parseInt(minHeight);
      if (maxHeight) searchQuery["stats.height.cm"].$lte = parseInt(maxHeight);
    }

    const models = await Model.find(searchQuery)
      .select("firstName lastName slug division categories photos stats")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Model.countDocuments(searchQuery);

    res.json({
      success: true,
      count: models.length,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
      filters: {
        query,
        division,
        category,
        gender,
        minHeight,
        maxHeight,
        hairColor,
        eyeColor,
      },
      data: models,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};

// controllers/modelController.js

// ... (keep all your existing GET functions above) ...

// ============================================
// CREATE MODEL (Protected)
// ============================================
// POST /api/models/admin
exports.createModel = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      division,
      categories,
      gender,
      dateOfBirth,
      stats,
      photos,
      social,
      location,
      isFeatured,
      isNewFace,
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !division || !categories) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, division, and categories are required",
      });
    }

    // Auto-generate slug if not provided
    let slug = req.body.slug;
    if (!slug) {
      slug = `${firstName}-${lastName}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    // Check if slug already exists
    const existingModel = await Model.findOne({ slug });
    if (existingModel) {
      return res.status(400).json({
        success: false,
        message: `Model with slug "${slug}" already exists. Please provide a unique slug.`,
      });
    }

    const model = await Model.create({
      firstName,
      lastName,
      slug,
      division,
      categories,
      gender,
      dateOfBirth,
      stats: stats || {},
      photos: photos || [],
      social: social || {},
      location: location || {},
      isFeatured: isFeatured || false,
      isNewFace: isNewFace || false,
      status: "active",
    });

    res.status(201).json({
      success: true,
      message: "Model created successfully",
      data: model,
    });
  } catch (error) {
    console.error("Create model error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create model",
      error: error.message,
    });
  }
};

// ============================================
// UPDATE MODEL (Protected)
// ============================================
// PUT /api/models/admin/:id
exports.updateModel = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If slug is being updated, check uniqueness
    if (updateData.slug) {
      const existing = await Model.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Slug already taken by another model",
        });
      }
    }

    const model = await Model.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    res.json({
      success: true,
      message: "Model updated successfully",
      data: model,
    });
  } catch (error) {
    console.error("Update model error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update model",
      error: error.message,
    });
  }
};

// ============================================
// DELETE MODEL (Protected)
// ============================================
// DELETE /api/models/admin/:id
exports.deleteModel = async (req, res) => {
  try {
    const { id } = req.params;

    const model = await Model.findByIdAndDelete(id);

    if (!model) {
      return res.status(404).json({
        success: false,
        message: "Model not found",
      });
    }

    // Optional: Delete photos from Cloudinary here if needed
    // await deleteImagesFromCloudinary(model.photos);

    res.json({
      success: true,
      message: "Model deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete model error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete model",
      error: error.message,
    });
  }
};
