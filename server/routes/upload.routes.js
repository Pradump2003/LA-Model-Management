const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { protect } = require("../middlewares/auth.middleware");
const uploadController = require("../controllers/upload.controller");

router.post(
  "/image",
  protect,
  upload.single("image"),
  uploadController.uploadSingleImage,
);
router.post(
  "/images",
  protect,
  upload.array("images", 10),
  uploadController.uploadMultipleImages,
);
router.post(
  "/video",
  protect,
  upload.single("video"),
  uploadController.uploadVideo,
);
router.delete("/image/:publicId", protect, uploadController.deleteImage);
router.delete("/images", protect, uploadController.deleteMultipleImages);
router.delete("/video/:publicId", protect, uploadController.deleteVideo);

module.exports = router;
