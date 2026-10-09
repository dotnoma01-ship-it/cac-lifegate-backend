const multer = require("multer");

const notFound = (req, res, next) => {
  res.status(404);

  const error = new Error(
    `Route not found: ${req.originalUrl}`
  );

  next(error);
};

const errorHandler = (error, req, res, next) => {
  let statusCode =
    res.statusCode === 200 ? 500 : res.statusCode;

  let message = error.message || "Internal server error.";

  if (error instanceof multer.MulterError) {
    statusCode = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;

    if (error.code === "LIMIT_FILE_SIZE") {
      message = "Image is too large. Maximum size is 5 MB.";
    } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected upload field. Please select an image.";
    } else {
      message = error.message;
    }
  } else if (
    error.message &&
    (
      error.message.includes("Unsupported image format") ||
      error.message.includes("Only JPG, PNG, WEBP, and GIF")
    )
  ) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    message,
    stack:
      process.env.NODE_ENV === "production"
        ? undefined
        : error.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
