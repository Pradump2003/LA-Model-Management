// controllers/contacts.controller.js
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contact");
const ApiResponse = require("../utils/ApiResponse.utils");
const {
  sendContactToAdmin,
  sendContactConfirmation,
} = require("../services/email.service");

// ============================================
// CREATE CONTACT (Public)
// ============================================
exports.createContact = asyncHandler(async (req, res) => {
  const { inquiryType, name, email, subject, message } = req.body;

  // Validation
  if (!inquiryType || !name || !email || !subject || !message) {
    return new ApiResponse(
      false,
      "inquiryType, name, email, subject, and message are required",
      null,
      400,
    ).send(res);
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new ApiResponse(
      false,
      "Please provide a valid email",
      null,
      400,
    ).send(res);
  }

  // Booking details validation
  if (req.body.inquiryType === "model-booking" && !req.body.bookingDetails) {
    return new ApiResponse(
      false,
      "Booking details required for model-booking inquiry",
      null,
      400,
    ).send(res);
  }

  // Create contact
  const contact = await Contact.create({
    ...req.body,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.headers["user-agent"],
    source: req.body.source || "website",
    status: "new",
  });

  // Send emails (non-blocking)
  Promise.all([
    sendContactToAdmin(contact),
    sendContactConfirmation(contact),
  ]).catch((err) => console.error("Contact email failed:", err.message));

  new ApiResponse(
    true,
    "Your inquiry has been submitted successfully",
    contact,
    201,
  ).send(res);
});

// ============================================
// GET ALL CONTACTS (Protected)
// ============================================
exports.getAllContacts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = "-createdAt",
    status,
    inquiryType,
    search,
    startDate,
    endDate,
  } = req.query;

  let filter = {};

  if (status) filter.status = status;
  if (inquiryType) filter.inquiryType = inquiryType;

  if (search) {
    const regex = new RegExp(
      search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );
    filter.$or = [
      { name: regex },
      { email: regex },
      { company: regex },
      { subject: regex },
    ];
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const [contacts, count] = await Promise.all([
    Contact.find(filter)
      .sort(sort)
      .limit(parseInt(limit, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
      .populate("bookingDetails.modelId", "firstName lastName slug"),
    Contact.countDocuments(filter),
  ]);

  new ApiResponse(true, "Contacts fetched successfully", contacts, 200, {
    count: contacts.length,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page, 10),
    total: count,
  }).send(res);
});

// ============================================
// GET SINGLE CONTACT (Protected)
// ============================================
exports.getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id).populate(
    "bookingDetails.modelId",
    "firstName lastName slug photos",
  );

  if (!contact) {
    return new ApiResponse(false, "Contact not found", null, 404).send(res);
  }

  new ApiResponse(true, "Contact fetched successfully", contact).send(res);
});

// ============================================
// UPDATE STATUS (Protected)
// ============================================
exports.updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !["new", "read"].includes(status)) {
    return new ApiResponse(
      false,
      "Invalid status. Valid: new, read",
      null,
      400,
    ).send(res);
  }

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true },
  );

  if (!contact) {
    return new ApiResponse(false, "Contact not found", null, 404).send(res);
  }

  new ApiResponse(true, "Status updated successfully", contact).send(res);
});

// ============================================
// DELETE CONTACT (Protected)
// ============================================
exports.deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return new ApiResponse(false, "Contact not found", null, 404).send(res);
  }

  new ApiResponse(true, "Contact deleted successfully").send(res);
});

// ============================================
// DELETE MULTIPLE (Protected)
// ============================================
exports.deleteMultipleContacts = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return new ApiResponse(false, "ids array is required", null, 400).send(res);
  }

  const result = await Contact.deleteMany({ _id: { $in: ids } });

  new ApiResponse(true, `${result.deletedCount} contacts deleted`, {
    deletedCount: result.deletedCount,
  }).send(res);
});

// ============================================
// MARK ALL READ (Protected)
// ============================================
exports.markAllAsRead = asyncHandler(async (req, res) => {
  const result = await Contact.updateMany(
    { status: "new" },
    { status: "read" },
  );

  new ApiResponse(true, `${result.modifiedCount} contacts marked as read`, {
    modifiedCount: result.modifiedCount,
  }).send(res);
});

// ============================================
// NEW COUNT (Protected) ← ADD THIS
// ============================================
exports.getNewContactsCount = asyncHandler(async (req, res) => {
  const count = await Contact.countDocuments({ status: "new" });

  new ApiResponse(true, "New contacts count", { count }).send(res);
});

// ============================================
// CONTACT STATS (Protected) ← ADD THIS
// ============================================
exports.getContactStats = asyncHandler(async (req, res) => {
  const stats = await Contact.aggregate([
    {
      $facet: {
        byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        byType: [{ $group: { _id: "$inquiryType", count: { $sum: 1 } } }],
        total: [{ $count: "count" }],
        newCount: [{ $match: { status: "new" } }, { $count: "count" }],
        today: [
          {
            $match: {
              createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
              },
            },
          },
          { $count: "count" },
        ],
        thisWeek: [
          {
            $match: {
              createdAt: {
                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              },
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  new ApiResponse(true, "Contact stats fetched", stats[0]).send(res);
});
