// routes/modelRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllModels,
  getModelsByDivision,
  getModelsByCategory,
  getModelsByDivisionAndCategory,
  getModelBySlug,
  searchModels,
  getFeaturedModels,
  getNewFaces,
  createModel,
  updateModel,
  deleteModel,
} = require("../controllers/model.controller");
const { protect } = require("../middlewares/auth.middleware");

// ============================================
// MODEL ROUTES
// ============================================

// Get all active models
// GET /api/models
router.get("/", getAllModels);

// Get featured models
// GET /api/models/featured
router.get("/featured", getFeaturedModels);

// Get new faces
// GET /api/models/new-faces
router.get("/new-faces", getNewFaces);

// Search models
// GET /api/models/search
router.get("/search", searchModels);

// Get models by division
// GET /api/models/division/:division
router.get("/division/:division", getModelsByDivision);

// Get models by category
// GET /api/models/category/:category
router.get("/category/:category", getModelsByCategory);

// Get models by division AND category
// GET /api/models/division/:division/category/:category
router.get(
  "/division/:division/category/:category",
  getModelsByDivisionAndCategory,
);

// Get single model by slug (MUST BE LAST)
// GET /api/models/:slug
router.get("/:slug", getModelBySlug);

router.post("/", protect, createModel);

// Update a model
// PUT /api/models/:id
router.put("/:id", protect, updateModel);

// Delete a model
// DELETE /api/models/:id
router.delete("/:id", protect, deleteModel);

module.exports = router;
