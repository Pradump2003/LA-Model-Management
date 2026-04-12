require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database.config");
const cors = require("cors");
const modelRoutes = require("./routes/model.routes");
const uploadRoutes = require("./routes/upload.routes")
const contactRoutes = require("./routes/contact.routes");
const applicationRoutes = require("./routes/application.routes");
const blogRoutes = require("./routes/blogs.routes");

const app = express();

connectDB();

const allowedOrigins = (process.env.CORS_ORIGINS || "https://la-model-management.vercel.app")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (no Origin header) and configured frontends.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(
  express.json({ limit: process.env.JSON_BODY_LIMIT || "50mb" }),
);
app.use(
  express.urlencoded({ extended: true, limit: process.env.URLENCODED_BODY_LIMIT || "50mb" }),
);

app.use("/api/models", modelRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/blogs", blogRoutes);

// Error handler (payload too large, multer limits, etc.)
// Keep this AFTER routes.
app.use((err, req, res, next) => {
  if (!err) return next();

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message || "Validation error",
      errors: Object.fromEntries(
        Object.entries(err.errors || {}).map(([key, val]) => [
          key,
          val?.message || "Invalid value",
        ]),
      ),
    });
  }

  // Body-parser / express.json payload too large
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message:
        "Payload too large. Please upload smaller files or reduce request size.",
    });
  }

  // Multer limits
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "One of the uploaded files is too large.",
    });
  }

  if (err.code === "LIMIT_FIELD_VALUE" || err.code === "LIMIT_FIELD_KEY") {
    return res.status(413).json({
      success: false,
      message:
        "Form field is too large. Please reduce the size of text fields or send files as multipart.",
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});


const PORT = Number.parseInt(process.env.PORT, 10) || 9000;
const HOST = process.env.HOST || undefined;

app.listen(PORT, HOST, () => {
  console.log(`Server is running on port ${PORT}`);
});
