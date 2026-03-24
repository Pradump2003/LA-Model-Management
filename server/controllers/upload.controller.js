// controllers/uploadController.js
const asyncHandler = require("express-async-handler");
const uploadService = require("../services/upload.service");
const ApiResponse = require("../utils/ApiResponse.utils");

// ============================================
// UPLOAD SINGLE IMAGE
// ============================================
exports.uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return new ApiResponse(false, "No file uploaded", null, 400).send(res);
  }

  const result = await uploadService.uploadImage(
    req.file.path,
    req.body.folder || "uploads"
  );

  new ApiResponse(true, "Image uploaded successfully", {
    url: result.secure_url,
    publicId: result.public_id,
  }, 201).send(res);
});

// ============================================
// UPLOAD MULTIPLE IMAGES
// ============================================
exports.uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return new ApiResponse(false, "No files uploaded", null, 400).send(res);
  }

  const results = await uploadService.uploadMultipleImages(
    req.files,
    req.body.folder || "uploads"
  );

  new ApiResponse(true, `${results.length} images uploaded successfully`, 
    results.map((r) => ({
      url: r.secure_url,
      publicId: r.public_id,
    })),
    201
  ).send(res);
});

// ============================================
// UPLOAD VIDEO
// ============================================
exports.uploadVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    return new ApiResponse(false, "No video uploaded", null, 400).send(res);
  }

  const result = await uploadService.uploadVideo(
    req.file.path,
    req.body.folder || "videos"
  );

  const thumbnail = uploadService.getVideoThumbnail(result.public_id);

  new ApiResponse(true, "Video uploaded successfully", {
    url: result.secure_url,
    publicId: result.public_id,
    thumbnail,
  }, 201).send(res);
});

// ============================================
// DELETE SINGLE IMAGE
// ============================================
exports.deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  if (!publicId) {
    return new ApiResponse(false, "Public ID is required", null, 400).send(res);
  }

  await uploadService.deleteImage(decodeURIComponent(publicId));

  new ApiResponse(true, "Image deleted successfully", null, 200).send(res);
});

// ============================================
// DELETE MULTIPLE IMAGES
// ============================================
exports.deleteMultipleImages = asyncHandler(async (req, res) => {
  const { publicIds } = req.body;

  if (!publicIds || !Array.isArray(publicIds)) {
    return new ApiResponse(false, "publicIds array is required", null, 400).send(res);
  }

  if (publicIds.length === 0) {
    return new ApiResponse(false, "publicIds array cannot be empty", null, 400).send(res);
  }

  await uploadService.deleteMultipleImages(publicIds);

  new ApiResponse(true, `${publicIds.length} images deleted successfully`, null, 200).send(res);
});

// ============================================
// DELETE VIDEO
// ============================================
exports.deleteVideo = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  if (!publicId) {
    return new ApiResponse(false, "Public ID is required", null, 400).send(res);
  }

  await uploadService.deleteVideo(decodeURIComponent(publicId));

  new ApiResponse(true, "Video deleted successfully", null, 200).send(res);
});