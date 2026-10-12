require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const cloudinary = require("./config/cloudinary");

const Gallery = require("./models/Gallery");
const Leadership = require("./models/Leadership");
const Ministry = require("./models/Ministry");
const Event = require("./models/Event");
const Sermon = require("./models/Sermon");

const uploadDirectory = path.join(__dirname, "uploads");

const collections = [
  { name: "Gallery", model: Gallery, field: "imageUrl" },
  { name: "Leadership", model: Leadership, field: "imageUrl" },
  { name: "Ministry", model: Ministry, field: "imageUrl" },
  { name: "Event", model: Event, field: "imageUrl" },
  { name: "Sermon", model: Sermon, field: "thumbnailUrl" },
];

const dryRun = process.argv.includes("--dry-run");

function getFilename(imageUrl) {
  if (!imageUrl) return null;

  try {
    const pathname = new URL(imageUrl, "http://localhost").pathname;
    const filename = path.basename(pathname);

    // Only consider images that use the old uploads directory.
    if (!pathname.includes("/uploads/")) {
      return null;
    }

    return filename;
  } catch {
    return null;
  }
}

async function uploadImage(filename) {
  const localPath = path.join(uploadDirectory, filename);

  const result = await cloudinary.uploader.upload(localPath, {
    folder: "cac-lifegate/migrated",
    resource_type: "image",
    public_id: path.parse(filename).name,
    overwrite: false,
  });

  return result.secure_url;
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from your backend .env file.");
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("One or more Cloudinary environment variables are missing.");
  }

  if (!fs.existsSync(uploadDirectory)) {
    throw new Error("The backend uploads folder does not exist.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  console.log("\nConnected to MongoDB.");
  console.log(dryRun ? "DRY RUN: No changes will be made.\n" : "LIVE MIGRATION STARTED.\n");

  const uploadedUrls = new Map();
  let matchedCount = 0;
  let updatedCount = 0;
  let missingFiles = 0;

  for (const collection of collections) {
    const documents = await collection.model.find({
      [collection.field]: { $regex: "/uploads/" },
    });

    for (const document of documents) {
      const oldUrl = document[collection.field];
      const filename = getFilename(oldUrl);

      if (!filename) {
        continue;
      }

      const localPath = path.join(uploadDirectory, filename);

      if (!fs.existsSync(localPath)) {
        console.log(
          `[MISSING LOCAL FILE] ${collection.name}: ${document._id} -> ${filename}`
        );

        missingFiles++;
        continue;
      }

      matchedCount++;

      console.log(
        `[MATCH] ${collection.name}: "${document.title || document.name || document._id}"`
      );
      console.log(`  Old URL: ${oldUrl}`);
      console.log(`  Local file: ${filename}`);

      if (dryRun) {
        continue;
      }

      try {
        let newUrl = uploadedUrls.get(filename);

        if (!newUrl) {
          newUrl = await uploadImage(filename);
          uploadedUrls.set(filename, newUrl);

          console.log(`  Uploaded to Cloudinary: ${newUrl}`);
        }

        document[collection.field] = newUrl;
        await document.save();

        updatedCount++;

        console.log("  MongoDB record updated successfully.\n");
      } catch (error) {
        console.error(
          `  FAILED: ${collection.name} ${document._id}: ${error.message}\n`
        );
      }
    }
  }

  console.log("\n========== MIGRATION SUMMARY ==========");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE MIGRATION"}`);
  console.log(`Matching records with local files: ${matchedCount}`);
  console.log(`Records updated: ${updatedCount}`);
  console.log(`Records with missing local files: ${missingFiles}`);
  console.log("=======================================\n");

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("\nMigration stopped:", error.message);

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  process.exitCode = 1;
});