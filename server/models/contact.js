// models/Contact.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    // Type of inquiry
    inquiryType: {
      type: String,
      enum: [
        "general",
        "model-booking",
        "brand-partnership",
        "media-request",
        "collaboration",
        "other",
      ],
      required: true,
    },

    // Contact Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: String,
    company: String,

    // Inquiry Details
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },

    // If booking request
    bookingDetails: {
      modelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Model",
      },
      modelName: String,
      projectType: String,
      shootDate: Date,
      location: String,
    },

    // Status
    status: {
      type: String,
      enum: ["new", "read"],
      default: "new",
    },

    // Metadata
    source: {
      type: String,
      default: "website",
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  },
);

// Indexes
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

module.exports =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);
