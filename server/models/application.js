// models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
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
      bust: String,
      cup: String,
      waist: String,
      hips: String,
      dress: String,
      shoe: String,
      chest: String,
      suit: String,
      shirt: String,
      neck: String,
      sleeve: String,
      inseam: String,
      hairColor: String,
      eyeColor: String,
    },

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

    parent: {
      required: Boolean,
      name: String,
      relationship: String,
      phone: String,
      email: String,
    },

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

    skills: {
      acting: Boolean,
      dancing: Boolean,
      singing: Boolean,
      sports: [String],
      languages: [String],
      instruments: [String],
      other: [String],
    },

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
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    introVideo: {
      url: String,
      publicId: String,
      thumbnail: String,
    },

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

    // ✅ FIXED: Changed from ref: "Admin" to simple String
    adminNotes: [
      {
        note: String,
        addedBy: String,
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ✅ FIXED: Changed from ref: "Admin" to simple String
    internalRating: {
      looks: Number,
      potential: Number,
      marketability: Number,
      overall: Number,
      ratedBy: String,
    },

    // ✅ FIXED: Changed from ref: "Admin" to simple String
    reviewedBy: String,
    reviewedAt: Date,

    // ✅ This stays (Model exists)
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
    },

    // ✅ FIXED: Changed from ref: "Admin" to simple String
    communications: [
      {
        type: {
          type: String,
          enum: ["email", "phone", "meeting", "note"],
        },
        subject: String,
        message: String,
        sentBy: String,
        sentAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

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

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
