// models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
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
    phone: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "non-binary"],
      required: true,
    },
    ethnicity: String,

    // Applying for which division - YOUR SPECIFIC STRUCTURE
    applyingFor: {
      division: {
        type: String,
        enum: [
          "women",
          "men",
          "newFaces",
          "direct",
          "special-booking",
          "juniors",
        ],
        required: true,
      },
      categories: [
        {
          type: String,
          enum: [
            "main-board",
            "new-faces",
            "direct",
            "classic",
            "girls",
            "boys",
            "family",
          ],
        },
      ],
    },

    // Physical Stats
    stats: {
      height: {
        feet: String,
        inches: String,
        cm: Number,
      },
      weight: {
        lbs: Number,
        kg: Number,
      },
      // For Women/Girls
      bust: String,
      waist: String,
      hips: String,
      dress: String,
      shoe: String,
      // For Men/Boys
      chest: String,
      suit: String,
      neck: String,
      sleeve: String,
      inseam: String,
      // Common
      hairColor: String,
      eyeColor: String,
    },

    // Location
    location: {
      street: String,
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: String,
      country: {
        type: String,
        default: "USA",
      },
    },

    // Parent/Guardian (if under 18 - especially for juniors division)
    parent: {
      required: Boolean,
      name: String,
      relationship: String,
      phone: String,
      email: String,
    },

    // Experience & Background
    experience: {
      level: {
        type: String,
        enum: ["no-experience", "some-experience", "professional"],
      },
      description: String,
      previousAgencies: [String],
      professionalPhotos: {
        type: Boolean,
        default: false,
      },
      portfolio: {
        clients: [String],
        campaigns: [String],
        editorials: [String],
      },
    },

    // Special Skills
    skills: {
      acting: Boolean,
      dancing: Boolean,
      singing: Boolean,
      sports: [String],
      languages: [String],
      instruments: [String],
      other: [String],
    },

    // Social Media
    social: {
      instagram: String,
      tiktok: String,
      youtube: String,
      twitter: String,
      followers: {
        instagram: Number,
        tiktok: Number,
        youtube: Number,
      },
    },

    // Photos - Required uploads
    photos: [
      {
        url: String,
        publicId: String,
        type: {
          type: String,
          enum: [
            "headshot-smiling",
            "headshot-no-smile",
            "full-body-front",
            "full-body-side",
            "full-body-back",
            "close-up",
            "casual",
            "professional",
            "polaroid",
            "other",
          ],
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Video introduction (optional)
    introVideo: {
      url: String,
      publicId: String,
      thumbnail: String,
    },

    // Additional Information
    additionalInfo: {
      howDidYouHear: {
        type: String,
        enum: ["instagram", "google", "referral", "scout", "tiktok", "other"],
      },
      referredBy: String,
      scoutName: String,
      scoutCode: String,
      availableToTravel: Boolean,
      availableToRelocate: Boolean,
      hasValidPassport: Boolean,
      visaStatus: String,
      legalToWork: Boolean,
    },

    // Consent & Agreements
    agreements: {
      termsAccepted: {
        type: Boolean,
        required: true,
      },
      photoReleaseAccepted: {
        type: Boolean,
        required: true,
      },
      ageVerified: {
        type: Boolean,
        required: true,
      },
      parentalConsent: Boolean,
      acceptedAt: Date,
    },

    // Application Status & Tracking
    status: {
      type: String,
      enum: [
        "submitted",
        "under-review",
        "shortlisted",
        "interview-scheduled",
        "approved",
        "rejected",
        "waitlist",
        "contacted",
        "signed",
      ],
      default: "submitted",
    },

    // Admin Notes & Reviews
    adminNotes: [
      {
        note: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Admin",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Rating/Scoring (internal)
    internalRating: {
      looks: Number,
      potential: Number,
      marketability: Number,
      overall: Number,
      ratedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
    },

    // Review tracking
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    reviewedAt: Date,

    // If approved, link to created model
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
    },

    // Communication history
    communications: [
      {
        type: {
          type: String,
          enum: ["email", "phone", "meeting", "note"],
        },
        subject: String,
        message: String,
        sentBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Admin",
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // IP & Device info
    submission: {
      ipAddress: String,
      userAgent: String,
      source: String,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
applicationSchema.index({ email: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });
applicationSchema.index({ "applyingFor.division": 1, status: 1 });

// Calculate age
applicationSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  return Math.floor((new Date() - new Date(this.dateOfBirth)) / 31557600000);
});

module.exports = mongoose.model("Application", applicationSchema);
