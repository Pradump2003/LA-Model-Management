// models/Blog.js
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
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

    excerpt: {
      type: String,
      required: true,
      maxlength: 300,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },

    featuredImage: {
      url: String,
      publicId: String,
      alt: String,
    },

    gallery: [
      {
        url: String,
        publicId: String,
        caption: String,
        order: Number,
      },
    ],

    category: {
      type: String,
      enum: [
        "agency-news",
        "model-spotlight",
        "fashion-week",
        "campaigns",
        "editorials",
        "behind-the-scenes",
        "industry-news",
        "events",
        "runway",
        "awards",
        "diversity",
        "tips-advice",
        "interviews",
      ],
      required: true,
    },

    // Tags
    tags: [String],

    // Related Models (if featuring specific models)
    featuredModels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Model",
      },
    ],

    // Author Info
    author: {
      name: {
        type: String,
        default: "LA Models Team",
      },
      avatar: String,
    },

    // Publishing
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: Date,

    // SEO
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],

    // Engagement Metrics
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },

    // Featured/Pinned
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },

    // Reading Time (auto-calculated)
    readingTime: {
      type: Number, // in minutes
      default: 5,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ isFeatured: -1, publishedAt: -1 });

// Virtual for formatted date
blogSchema.virtual("formattedDate").get(function () {
  if (!this.publishedAt) return null;
  return this.publishedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

// Calculate reading time based on content
// ✅ Fix 1: Calculate reading time
blogSchema.pre("save", async function () {
  if (this.content) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
});

// ✅ Fix 2: Auto-generate slug
blogSchema.pre("save", async function () {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

module.exports = mongoose.model("Blog", blogSchema);
