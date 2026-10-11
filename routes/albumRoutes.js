const express = require("express");
const multer = require("multer");

const Album = require("../models/Album");
const cloudinary = require("../config/cloudinary");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Only allow these image formats.
const allowedTypes = {
  "image/jpeg": true,
  "image/png": true,
  "image/webp": true,
  "image/gif": true,
};

// Keep uploaded files in memory before sending them to Cloudinary.
const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (!allowedTypes[file.mimetype]) {
    return callback(
      new Error("Only JPG, PNG, WEBP, and GIF images are allowed.")
    );
  }

  callback(null, true);
};

// Maximum 20 images per upload, 5 MB per image.
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 20,
  },
});

// Upload one image buffer to Cloudinary.
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "cac-lifegate/albums",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

// Remove an image from Cloudinary.
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  } catch (error) {
    console.error("Cloudinary deletion failed:", error.message);
  }
};

// PATCH /api/albums/:id/publish
// Protected: publish or unpublish an album.
router.patch("/:id/publish", authMiddleware, async (req, res) => {
  try {
    const { isPublished } = req.body;

    if (typeof isPublished !== "boolean") {
      return res.status(400).json({
        message: "isPublished must be true or false.",
      });
    }

    const album = await Album.findByIdAndUpdate(
      req.params.id,
      { isPublished },
      { new: true, runValidators: true }
    );

    if (!album) {
      return res.status(404).json({
        message: "Album not found.",
      });
    }

    return res.json({
      message: isPublished
        ? "Album published successfully."
        : "Album unpublished successfully.",
      album,
    });
  } catch (error) {
    console.error("Update album publication error:", error.message);

    return res.status(400).json({
      message: "Unable to update album publication status.",
    });
  }
});

// GET /api/albums/admin/all
// Protected: retrieve all albums for the admin dashboard.
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    const albums = await Album.find().sort({
      eventDate: -1,
      createdAt: -1,
    });

    return res.json(albums);
  } catch (error) {
    console.error("Fetch all admin albums error:", error.message);

    return res.status(500).json({
      message: "Failed to retrieve albums.",
    });
  }
});

// GET /api/albums
// Public: retrieve published albums.
router.get("/", async (req, res) => {
  try {
    const albums = await Album.find({
      isPublished: true,
    }).sort({ eventDate: -1, createdAt: -1 });

    res.json(albums);
  } catch (error) {
    console.error("Fetch albums error:", error.message);

    res.status(500).json({
      message: "Failed to retrieve albums.",
    });
  }
});

// GET /api/albums/:id
// Public: retrieve one published album.
router.get("/:id", async (req, res) => {
  try {
    const album = await Album.findOne({
      _id: req.params.id,
      isPublished: true,
    });

    if (!album) {
      return res.status(404).json({
        message: "Album not found.",
      });
    }

    res.json(album);
  } catch (error) {
    res.status(400).json({
      message: "Invalid album ID or unable to retrieve album.",
    });
  }
});

// POST /api/albums
// Protected: create an album and upload multiple images.
router.post("/", authMiddleware, (req, res, next) => {
  upload.array("images", 20)(req, res, async (uploadError) => {
    if (uploadError) {
      return next(uploadError);
    }

    const uploadedImages = [];

    try {
      const { title, description, category, eventDate } = req.body;

const isPublished =
  req.body.isPublished === undefined
    ? true
    : req.body.isPublished === "true";

if (
  req.body.isPublished !== undefined &&
  !["true", "false"].includes(req.body.isPublished)
) {
  return res.status(400).json({
    message: "Publication status must be true or false.",
  });
}

      if (!title || !title.trim()) {
        return res.status(400).json({
          message: "Please provide an album title.",
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: "Please select at least one image.",
        });
      }

      // Upload every selected image to Cloudinary.
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);

        uploadedImages.push({
          imageUrl: result.secure_url,
          publicId: result.public_id,
          caption: "",
        });
      }

      const album = await Album.create({
  title: title.trim(),
  description: description || "",
  category: category || "Church",
  eventDate: eventDate || new Date(),
  images: uploadedImages,
  coverImage: uploadedImages[0].imageUrl,
  isPublished,
});

      return res.status(201).json({
        message: "Album created successfully.",
        album,
      });
    } catch (error) {
      console.error("Create album error:", error.message);

      // If creation fails, clean up images already uploaded.
      await Promise.all(
        uploadedImages.map((image) =>
          deleteFromCloudinary(image.publicId)
        )
      );

      return res.status(500).json({
        message: "Failed to create album. Please try again.",
      });
    }
  });
});

// POST /api/albums/:id/images
// Protected: add more images to an existing album.
router.post("/:id/images", authMiddleware, (req, res, next) => {
  upload.array("images", 20)(req, res, async (uploadError) => {
    if (uploadError) {
      return next(uploadError);
    }

    const uploadedImages = [];

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          message: "Please select at least one image.",
        });
      }

      const album = await Album.findById(req.params.id);

      if (!album) {
        return res.status(404).json({
          message: "Album not found.",
        });
      }

      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);

        uploadedImages.push({
          imageUrl: result.secure_url,
          publicId: result.public_id,
          caption: "",
        });
      }

      album.images.push(...uploadedImages);

      if (!album.coverImage && uploadedImages.length > 0) {
        album.coverImage = uploadedImages[0].imageUrl;
      }

      await album.save();

      return res.json({
        message: "Images added to album successfully.",
        album,
      });
    } catch (error) {
      console.error("Add album images error:", error.message);

      await Promise.all(
        uploadedImages.map((image) =>
          deleteFromCloudinary(image.publicId)
        )
      );

      return res.status(500).json({
        message: "Failed to add images to album.",
      });
    }
  });
});

// DELETE /api/albums/:id/images/:imageId
// Protected: delete one image from an album.
router.delete(
  "/:id/images/:imageId",
  authMiddleware,
  async (req, res) => {
    try {
      const album = await Album.findById(req.params.id);

      if (!album) {
        return res.status(404).json({
          message: "Album not found.",
        });
      }

      const image = album.images.id(req.params.imageId);

      if (!image) {
        return res.status(404).json({
          message: "Image not found in this album.",
        });
      }

      const publicId = image.publicId;

      image.deleteOne();

      album.coverImage =
        album.images.length > 0
          ? album.images[0].imageUrl
          : "";

      await album.save();

      if (publicId) {
        await deleteFromCloudinary(publicId);
      }

      res.json({
        message: "Image deleted successfully.",
        album,
      });
    } catch (error) {
      console.error("Delete album image error:", error.message);

      res.status(400).json({
        message: "Failed to delete image.",
      });
    }
  }
);

// DELETE /api/albums/:id
// Protected: delete an album and its Cloudinary images.
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        message: "Album not found.",
      });
    }

    const publicIds = album.images
      .map((image) => image.publicId)
      .filter(Boolean);

    await Album.findByIdAndDelete(req.params.id);

    await Promise.all(
      publicIds.map((publicId) => deleteFromCloudinary(publicId))
    );

    res.json({
      message: "Album and its images deleted successfully.",
    });
  } catch (error) {
    console.error("Delete album error:", error.message);

    res.status(500).json({
      message: "Failed to delete album.",
    });
  }
});

module.exports = router;