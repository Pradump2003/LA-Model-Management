// models/Model.js
const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
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
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // Division/Category
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
          // Men and women categories
          "main-board",
          "new-faces",
          // direct categories
          "direct",
          "classic",
          // juniors categories
          "girls",
          "boys",
          "family",
        ],
      },
    ],

    // Personal Details
    gender: {
      type: String,
      enum: ["male", "female", "non-binary"],
    },
    dateOfBirth: Date,
    age: Number,
    ethnicity: String,

    // Physical Stats (Measurements)
    stats: {
      // Height
      height: {
        feet: String, // e.g., "5'10""
        cm: Number, // e.g., 178
      },

      // For Women
      bust: String, // e.g., "34"
      cup: String, // e.g., "B"
      waist: String, // e.g., "24"
      hips: String, // e.g., "35"
      dress: String, // e.g., "2-4"
      shoe: String, // e.g., "8"

      // For Men
      chest: String, // e.g., "40"
      suit: String, // e.g., "40R"
      shirt: String, // e.g., "15.5"
      insideLeg: String, // e.g., "15.5"
      sleeve: String, // e.g., "34"
      inseam: String, // e.g., "32"

      // Common
      hairColor: String,
      eyeColor: String,
      weight: String,
    },

    // Portfolio/Media
    photos: [
      {
        url: String,
        publicId: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
        isPortrait: Boolean,
        category: {
          type: String,
          enum: [
            "polaroid",
            "portfolio",
            "editorial",
            "runway",
            "digitals",
            "headshot",
          ],
        },
        order: Number,
      },
    ],

    videos: [
      {
        url: String,
        publicId: String,
        thumbnail: String,
        title: String,
        order: Number,
      },
    ],

    // Professional Info
    experience: {
      type: String,
      enum: ["new-face", "experienced", "established"],
    },

    // Featured work/brands
    portfolio: {
      clients: [String], // e.g., ["Gucci", "Prada", "Vogue"]
      editorials: [String],
      campaigns: [String],
      runwayShows: [String],
      awards: [String],
    },

    // Social Media & Links
    social: {
      instagram: String,
      tiktok: String,
      twitter: String,
      youtube: String,
      website: String,
    },

    // Stats & Metrics
    metrics: {
      instagramFollowers: Number,
      tiktokFollowers: Number,
      engagementRate: Number,
    },

    // Location
    location: {
      based: String, // e.g., "Los Angeles"
      available: [String], // e.g., ["Los Angeles", "New York", "London"]
    },

    // Special attributes
    features: {
      tattoos: Boolean,
      piercings: Boolean,
      specialSkills: [String], // e.g., ["Dancing", "Singing", "Sports"]
    },

    // Model card info
    card: {
      pdfUrl: String,
      publicId: String,
      lastUpdated: Date,
    },

    // Status & Visibility
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewFace: {
      type: Boolean,
      default: false,
    },

    // SEO
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
modelSchema.index({ division: 1, status: 1 });
modelSchema.index({ categories: 1, status: 1 });
modelSchema.index({ slug: 1 });
modelSchema.index({ firstName: 1, lastName: 1 });
modelSchema.index({ isFeatured: -1, createdAt: -1 });

// Virtual for full name
modelSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age calculation
modelSchema.virtual("currentAge").get(function () {
  if (!this.dateOfBirth) return null;
  return Math.floor((new Date() - new Date(this.dateOfBirth)) / 31557600000);
});

module.exports = mongoose.model("Model", modelSchema);
