// routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { protect } = require("../middlewares/auth.middleware");
const {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  addAdminNote,
  addInternalRating,
  addCommunication,
  linkToModel,
  deleteApplication,
  deleteMultipleApplications,
  getNewApplicationsCount,
  getApplicationStats,
} = require("../controllers/application.controller");

// Public
router.post("/", upload.array("photos", 6), submitApplication);

// Protected
router.get("/", protect, getAllApplications);
router.get("/stats", protect, getApplicationStats);
router.get("/new-count", protect, getNewApplicationsCount);
router.delete("/bulk-delete", protect, deleteMultipleApplications);
router.get("/:id", protect, getApplicationById);
router.patch("/:id/status", protect, updateApplicationStatus);
router.post("/:id/notes", protect, addAdminNote);
router.post("/:id/rating", protect, addInternalRating);
router.post("/:id/communications", protect, addCommunication);
router.patch("/:id/link-model", protect, linkToModel);
router.delete("/:id", protect, deleteApplication);

module.exports = router;
