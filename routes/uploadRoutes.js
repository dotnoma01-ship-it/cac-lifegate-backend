const express = require("express");
const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// Supported image formats
const allowedTypes = {
  "image/jpeg": true,
  "image/png": true,
  "image/webp": true,
  "image/gif": true,
};

// Store uploaded images in memory temporarily.
// Cloudinary will handle permanent image storage.
const storage = multer.memoryStorage();

// Validate uploaded file types
const fileFilter = (req, file, callback) => {
  if (!allowedTypes[file.mimetype]) {
    return callback(
      new Error("Only JPG, PNG, WEBP, and GIF images are allowed.")
    );
  }

  callback(null, true);
};

// Configure upload limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

// Upload an image to Cloudinary
router.post("/", authMiddleware, (req, res, next) => {
  upload.single("image")(req, res, async (error) => {
    if (error) {
      return next(error);
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image to upload.",
      });
    }

    try {
      // Send the image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "cac-lifegate",
            resource_type: "image",
          },
          (uploadError, uploadResult) => {
            if (uploadError) {
              return reject(uploadError);
            }

            resolve(uploadResult);
          }
        );

        stream.end(req.file.buffer);
      });

      // Return the permanent Cloudinary URL
      return res.status(201).json({
        message: "Image uploaded successfully.",
        imageUrl: result.secure_url,
        filename: result.public_id,
      });
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError.message);

      return res.status(500).json({
        message: "Image upload failed. Please try again.",
      });
    }
  });
});

module.exports = router;