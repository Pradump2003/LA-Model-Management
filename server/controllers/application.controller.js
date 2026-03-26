// controllers/applicationController.js
const asyncHandler = require("express-async-handler");
const Application = require("../models/application");
const ApiResponse = require("../utils/ApiResponse.utils");
const {
  sendApplicationToAdmin,
  sendApplicationConfirmation,
} = require("../services/email.service");

// ============================================
// SUBMIT APPLICATION (Public)
// ============================================
exports.submitApplication = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    gender,
    applyingFor,
    stats,
    location,
    agreements,
  } = req.body;

  // Required fields validation
  if (!firstName || !lastName || !email || !phone || !dateOfBirth || !gender) {
    return new ApiResponse(
      false,
      "firstName, lastName, email, phone, dateOfBirth, and gender are required",
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

  // Division validation
  if (!applyingFor || !applyingFor.division) {
    return new ApiResponse(false, "Division is required", null, 400).send(res);
  }

  // Location validation
  if (!location || !location.city || !location.state) {
    return new ApiResponse(
      false,
      "City and state are required",
      null,
      400,
    ).send(res);
  }

  // Agreements validation
  if (
    !agreements ||
    !agreements.termsAccepted ||
    !agreements.photoReleaseAccepted ||
    !agreements.ageVerified
  ) {
    return new ApiResponse(
      false,
      "You must accept terms, photo release, and verify age",
      null,
      400,
    ).send(res);
  }

  // Age check for juniors - parent info required
  const age = Math.floor((new Date() - new Date(dateOfBirth)) / 31557600000);

  if (
    (age < 18 || applyingFor.division === "juniors") &&
    (!req.body.parent || !req.body.parent.name || !req.body.parent.phone)
  ) {
    return new ApiResponse(
      false,
      "Parent/guardian information is required for applicants under 18",
      null,
      400,
    ).send(res);
  }

  // Check duplicate email
  const existingApplication = await Application.findOne({ email });
  if (existingApplication) {
    return new ApiResponse(
      false,
      "An application with this email already exists",
      null,
      409,
    ).send(res);
  }

  // Handle photos from multer
  let photos = [];
  if (req.files && req.files.length > 0) {
    photos = req.files.map((file, index) => ({
      url: file.path,
      publicId: file.filename,
      type: req.body.photoTypes
        ? req.body.photoTypes[index] || "other"
        : "other",
      uploadedAt: new Date(),
    }));
  } else if (req.body.photos) {
    photos = req.body.photos;
  }

  // Create application
  const application = await Application.create({
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    gender,
    ethnicity: req.body.ethnicity,
    applyingFor,
    stats: stats || {},
    location,
    parent: req.body.parent || {},
    experience: req.body.experience || {},
    skills: req.body.skills || {},
    social: req.body.social || {},
    photos,
    introVideo: req.body.introVideo || {},
    additionalInfo: req.body.additionalInfo || {},
    agreements: {
      ...agreements,
      acceptedAt: new Date(),
    },
    status: "submitted",
    submission: {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
      source: req.body.source || "website",
    },
  });

  // Send emails (non-blocking)
  Promise.all([
    sendApplicationToAdmin(application),
    sendApplicationConfirmation(application),
  ]).catch((err) => console.error("Application email failed:", err.message));

  new ApiResponse(
    true,
    "Your application has been submitted successfully",
    {
      _id: application._id,
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      applyingFor: application.applyingFor,
      status: application.status,
      createdAt: application.createdAt,
    },
    201,
  ).send(res);
});

// ============================================
// GET ALL APPLICATIONS (Protected)
// ============================================
exports.getAllApplications = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = "-createdAt",
    status,
    division,
    category,
    gender,
    experienceLevel,
    search,
    startDate,
    endDate,
    minAge,
    maxAge,
    city,
    state,
    hasVideo,
    source,
  } = req.query;

  let filter = {};

  // Status filter
  if (status) filter.status = status;

  // Division filter
  if (division) filter["applyingFor.division"] = division;

  // Category filter
  if (category) filter["applyingFor.categories"] = category;

  // Gender filter
  if (gender) filter.gender = gender;

  // Experience level filter
  if (experienceLevel) filter["experience.level"] = experienceLevel;

  // City filter
  if (city) {
    filter["location.city"] = new RegExp(
      city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );
  }

  // State filter
  if (state) filter["location.state"] = state;

  // Source filter
  if (source) filter["additionalInfo.howDidYouHear"] = source;

  // Has video filter
  if (hasVideo === "true") {
    filter["introVideo.url"] = { $exists: true, $ne: "" };
  }

  // Search
  if (search) {
    const regex = new RegExp(
      search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );
    filter.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { "location.city": regex },
      { "social.instagram": regex },
    ];
  }

  // Date range
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  // Age range
  if (minAge || maxAge) {
    const now = new Date();
    filter.dateOfBirth = {};
    if (maxAge) {
      filter.dateOfBirth.$gte = new Date(
        now.getFullYear() - parseInt(maxAge, 10) - 1,
        now.getMonth(),
        now.getDate(),
      );
    }
    if (minAge) {
      filter.dateOfBirth.$lte = new Date(
        now.getFullYear() - parseInt(minAge, 10),
        now.getMonth(),
        now.getDate(),
      );
    }
  }

  const [applications, count] = await Promise.all([
    Application.find(filter)
      .sort(sort)
      .limit(parseInt(limit, 10))
      .skip((parseInt(page, 10) - 1) * parseInt(limit, 10))
      .populate("reviewedBy", "name email")
      .populate("modelId", "firstName lastName slug"),
    Application.countDocuments(filter),
  ]);

  new ApiResponse(
    true,
    "Applications fetched successfully",
    applications,
    200,
    {
      count: applications.length,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      total: count,
    },
  ).send(res);
});

// ============================================
// GET SINGLE APPLICATION (Protected)
// ============================================
exports.getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate("reviewedBy", "name email")
    .populate("modelId", "firstName lastName slug photos")
    .populate("adminNotes.addedBy", "name")
    .populate("internalRating.ratedBy", "name")
    .populate("communications.sentBy", "name");

  if (!application) {
    return new ApiResponse(false, "Application not found", null, 404).send(res);
  }

  new ApiResponse(true, "Application fetched successfully", application).send(
    res,
  );
});

// ============================================
// UPDATE APPLICATION STATUS (Protected)
// ============================================
exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const validStatuses = [
    "submitted",
    "under-review",
    "shortlisted",
    "interview-scheduled",
    "approved",
    "rejected",
    "waitlist",
    "contacted",
    "signed",
  ];

  if (!status || !validStatuses.includes(status)) {
    return new ApiResponse(
      false,
      `Invalid status. Valid: ${validStatuses.join(", ")}`,
      null,
      400,
    ).send(res);
  }

  const updateData = {
    status,
    reviewedBy: req.user._id,
    reviewedAt: new Date(),
  };

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true },
  );

  if (!application) {
    return new ApiResponse(false, "Application not found", null, 404).send(res);
  }

  new ApiResponse(true, "Application status updated", application).send(res);
});

// ============================================
// ADD ADMIN NOTE (Protected)
// ============================================
exports.addAdminNote = asyncHandler(async (req, res) => {
  const { note } = req.body;

  if (!note || note.trim() === "") {
    return new ApiResponse(false, "Note is required", null, 400).send(res);
  }

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        adminNotes: {
          note,
          addedBy: req.user._id,
          addedAt: new Date(),
        },
      },
    },
    { new: true },
  ).populate("adminNotes.addedBy", "name");

  if (!application) {
    return new ApiResponse(false, "Application not found", null, 404).send(res);
  }

  new ApiResponse(true, "Note added successfully", application).send(res);
});

// ============================================
// ADD INTERNAL RATING (Protected)
// ============================================
exports.addInternalRating = asyncHandler(async (req, res) => {
  const { looks, potential, marketability } = req.body;

  if (!looks || !potential || !marketability) {
    return new ApiResponse(
      false,
      "looks, potential, and marketability ratings are required",
      null,
      400,
    ).send(res);
  }

  // Validate ratings (1-10)
  const ratings = [looks, potential, marketability];
  const invalid = ratings.some((r) => r < 1 || r > 10);

  if (invalid) {
    return new ApiResponse(
      false,
      "Ratings must be between 1 and 10",
      null,
      400,
    ).send(res);
  }

  const overall = Math.round(
    (parseInt(looks, 10) +
      parseInt(potential, 10) +
      parseInt(marketability, 10)) /
      3,
  );

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    {
      internalRating: {
        looks: parseInt(looks, 10),
        potential: parseInt(potential, 10),
        marketability: parseInt(marketability, 10),
        overall,
        ratedBy: req.user._id,
      },
    },
    { new: true },
  );

  if (!application) {
    return new ApiResponse(false, "Application not found", null, 404).send(res);
  }

  new ApiResponse(true, "Rating added successfully", application).send(res);
});

// ============================================
// ADD COMMUNICATION LOG (Protected)
// ============================================
exports.addCommunication = asyncHandler(async (req, res) => {
  const { type, subject, message } = req.body;

  if (!type || !subject || !message) {
    return new ApiResponse(
      false,
      "type, subject, and message are required",
      null,
      400,
    ).send(res);
  }

  const validTypes = ["email", "phone", "meeting", "note"];
  if (!validTypes.includes(type)) {
    return new ApiResponse(
      false,
      `Invalid type. Valid: ${validTypes.join(", ")}`,
      null,
      400,
    ).send(res);
  }

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        communications: {
          type,
          subject,
          message,
          sentBy: req.user._id,
          sentAt: new Date(),
        },
      },
    },
    { new: true },
  ).populate("communications.sentBy", "name");

  if (!application) {
    return new ApiResponse(false, "Application not found", null, 404).send(res);
  }

  new ApiResponse(true, "Communication logged successfully", application).send(
    res,
  );
});

// ============================================
// LINK APPLICATION TO MODEL (Protected)
// ============================================
exports.linkToModel = asyncHandler(async (req, res) => {
  const { modelId } = req.body;

  if (!modelId) {
    return new ApiResponse(false, "modelId is required", null, 400).send(res);
  }

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    {
      modelId,
      status: "signed",
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
    },
    { new: true },
  ).populate("modelId", "firstName lastName slug");

  if (!application) {
    return new ApiResponse(false, "Application not found", null, 404).send(res);
  }

  new ApiResponse(true, "Application linked to model", application).send(res);
});

// ============================================
// DELETE APPLICATION (Protected)
// ============================================
exports.deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findByIdAndDelete(req.params.id);

  if (!application) {
    return new ApiResponse(false, "Application not found", null, 404).send(res);
  }

  new ApiResponse(true, "Application deleted successfully").send(res);
});

// ============================================
// DELETE MULTIPLE (Protected)
// ============================================
exports.deleteMultipleApplications = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return new ApiResponse(false, "ids array is required", null, 400).send(res);
  }

  const result = await Application.deleteMany({ _id: { $in: ids } });

  new ApiResponse(true, `${result.deletedCount} applications deleted`, {
    deletedCount: result.deletedCount,
  }).send(res);
});

// ============================================
// NEW COUNT (Protected)
// ============================================
exports.getNewApplicationsCount = asyncHandler(async (req, res) => {
  const count = await Application.countDocuments({ status: "submitted" });

  new ApiResponse(true, "New applications count", { count }).send(res);
});

// ============================================
// APPLICATION STATS (Protected)
// ============================================
exports.getApplicationStats = asyncHandler(async (req, res) => {
  const stats = await Application.aggregate([
    {
      $facet: {
        byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        byDivision: [
          { $group: { _id: "$applyingFor.division", count: { $sum: 1 } } },
        ],
        byGender: [{ $group: { _id: "$gender", count: { $sum: 1 } } }],
        byExperience: [
          { $group: { _id: "$experience.level", count: { $sum: 1 } } },
        ],
        bySource: [
          {
            $group: {
              _id: "$additionalInfo.howDidYouHear",
              count: { $sum: 1 },
            },
          },
        ],
        byState: [
          { $group: { _id: "$location.state", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ],
        total: [{ $count: "count" }],
        newCount: [{ $match: { status: "submitted" } }, { $count: "count" }],
        shortlistedCount: [
          { $match: { status: "shortlisted" } },
          { $count: "count" },
        ],
        approvedCount: [
          { $match: { status: "approved" } },
          { $count: "count" },
        ],
        rejectedCount: [
          { $match: { status: "rejected" } },
          { $count: "count" },
        ],
        today: [
          {
            $match: {
              createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
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
        thisMonth: [
          {
            $match: {
              createdAt: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          },
          { $count: "count" },
        ],
        avgRating: [
          { $match: { "internalRating.overall": { $exists: true } } },
          { $group: { _id: null, avg: { $avg: "$internalRating.overall" } } },
        ],
      },
    },
  ]);

  new ApiResponse(true, "Application stats fetched", stats[0]).send(res);
});
