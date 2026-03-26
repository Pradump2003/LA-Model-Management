// routes/modelRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllModels,
  getModelBySlug,
  searchModels,
  getModelById,
  createModel,
  updateModel,
  deleteModel,
} = require("../controllers/model.controller");
const { protect } = require("../middlewares/auth.middleware");

// ============================================
// MODEL ROUTES
// ============================================

// Get all active models
router.get("/", getAllModels);
router.get("/:id", getModelById);

router.get("/search", searchModels); // Dedicated search endpoint

router.get("/:slug", getModelBySlug);

router.post("/", protect, createModel);

// Update a model
// PATCH /api/models/:id
router.patch("/:id", protect, updateModel);

// Delete a model
// DELETE /api/models/:id
router.delete("/:id", protect, deleteModel);

module.exports = router;
