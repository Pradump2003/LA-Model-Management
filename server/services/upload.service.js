const cloudinary = require("../config/cloudinary.config");
const fs = require("fs");

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Local file path
 * @param {string} folder - Cloudinary folder name
 * @returns {object} Cloudinary upload result
 */
exports.uploadImage = async (filePath, folder = "uploads") => {
  try { 
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      transformation: [
        { width: 1200, crop: "limit" }, // Max width 1200px
        { quality: "auto:good" }, // Auto quality optimization
        { fetch_format: "auto" }, // Auto format (WebP for supported browsers)
      ],
      resource_type: "auto", // Auto-detect file type
    });

    // Delete temporary file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result;
  } catch (error) {
    // Delete temporary file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * Upload multiple images
 * @param {array} files - Array of file paths
 * @param {string} folder - Cloudinary folder name
 * @returns {array} Array of upload results
 */
exports.uploadMultipleImages = async (files, folder = "uploads") => {
  try {
    const uploadPromises = files.map((file) =>
      this.uploadImage(file.path, folder),
    );
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error(`Multiple image upload failed: ${error.message}`);
  }
};

/**
 * Upload video to Cloudinary
 * @param {string} filePath - Local file path
 * @param {string} folder - Cloudinary folder name
 * @returns {object} Cloudinary upload result
 */
exports.uploadVideo = async (filePath, folder = "videos") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: "video",
      transformation: [
        { width: 1920, height: 1080, crop: "limit" },
        { quality: "auto:good" },
      ],
    });

    // Delete temporary file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result;
  } catch (error) {
    // Delete temporary file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Video upload failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {object} Deletion result
 */
exports.deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {array} publicIds - Array of Cloudinary public IDs
 * @returns {object} Deletion result
 */
exports.deleteMultipleImages = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    throw new Error(`Multiple image deletion failed: ${error.message}`);
  }
};

/**
 * Delete video from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {object} Deletion result
 */
exports.deleteVideo = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    return result;
  } catch (error) {
    throw new Error(`Video deletion failed: ${error.message}`);
  }
};

/**
 * Generate thumbnail from video
 * @param {string} publicId - Video public ID
 * @returns {string} Thumbnail URL
 */
exports.getVideoThumbnail = (publicId) => {
  return cloudinary.url(publicId, {
    resource_type: "video",
    format: "jpg",
    transformation: [{ width: 400, height: 300, crop: "fill" }],
  });
};

/**
 * Get optimized image URL
 * @param {string} publicId - Image public ID
 * @param {object} options - Transformation options
 * @returns {string} Optimized image URL
 */
exports.getOptimizedImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    fetch_format: "auto",
    quality: "auto",
  };

  return cloudinary.url(publicId, { ...defaultOptions, ...options });
};
