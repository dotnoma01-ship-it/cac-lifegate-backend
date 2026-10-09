const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const uploadDirectory = path.join(__dirname, "..", "uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedTypes = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (req, file, callback) => {
    const extension = allowedTypes[file.mimetype];

    if (!extension) {
      return callback(new Error("Unsupported image format."));
    }

    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (!allowedTypes[file.mimetype]) {
    return callback(
      new Error("Only JPG, PNG, WEBP, and GIF images are allowed.")
    );
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

router.post("/", authMiddleware, (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      return next(error);
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image to upload.",
      });
    }

    return res.status(201).json({
      message: "Image uploaded successfully.",
      imageUrl: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
  });
});

module.exports = router;
