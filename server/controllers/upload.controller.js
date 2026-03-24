// controllers/uploadController.js
const uploadService = require("../services/upload.service");

// Upload single image
exports.uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const result = await uploadService.uploadImage(
      req.file.path,
      req.body.folder || "uploads",
    );

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: { url: result.secure_url, publicId: result.public_id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload multiple images
exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const results = await uploadService.uploadMultipleImages(
      req.files,
      req.body.folder || "uploads",
    );

    res.json({
      success: true,
      message: `${results.length} images uploaded`,
      data: results.map((r) => ({ url: r.secure_url, publicId: r.public_id })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload video
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No video uploaded" });
    }

    const result = await uploadService.uploadVideo(
      req.file.path,
      req.body.folder || "videos",
    );
    const thumbnail = uploadService.getVideoThumbnail(result.public_id);

    res.json({
      success: true,
      message: "Video uploaded successfully",
      data: { url: result.secure_url, publicId: result.public_id, thumbnail },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete image
exports.deleteImage = async (req, res) => {
  try {
    await uploadService.deleteImage(decodeURIComponent(req.params.publicId));
    res.json({ success: true, message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete multiple images
exports.deleteMultipleImages = async (req, res) => {
  try {
    if (!req.body.publicIds || !Array.isArray(req.body.publicIds)) {
      return res
        .status(400)
        .json({ success: false, message: "publicIds array required" });
    }

    await uploadService.deleteMultipleImages(req.body.publicIds);
    res.json({ success: true, message: "Images deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete video
exports.deleteVideo = async (req, res) => {
  try {
    await uploadService.deleteVideo(decodeURIComponent(req.params.publicId));
    res.json({ success: true, message: "Video deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
