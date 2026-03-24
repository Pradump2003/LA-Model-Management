const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadDir = "uploads/temp";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed image formats
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  // Allowed video formats
  const allowedVideoTypes = /mp4|mov|avi|wmv/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  // Check if it's an image
  if (allowedImageTypes.test(extname) && mimetype.startsWith("image/")) {
    return cb(null, true);
  }

  // Check if it's a video
  if (allowedVideoTypes.test(extname) && mimetype.startsWith("video/")) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Invalid file type. Only JPEG, PNG, GIF, WebP images and MP4, MOV videos are allowed!",
    ),
    false,
  );
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: fileFilter,
});

module.exports = upload;
