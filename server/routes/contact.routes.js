// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  deleteMultipleContacts,
  markAllAsRead,
  getNewContactsCount,
  getContactStats,
} = require("../controllers/contacts.controller");

// Public
router.post("/", createContact);

// Protected
router.get("/", protect, getAllContacts);
router.get("/stats", protect, getContactStats);
router.get("/new-count", protect, getNewContactsCount);
router.patch("/mark-all-read", protect, markAllAsRead);
router.delete("/bulk-delete", protect, deleteMultipleContacts);
router.get("/:id", protect, getContactById);
router.patch("/:id/status", protect, updateContactStatus);
router.delete("/:id", protect, deleteContact);

module.exports = router;
