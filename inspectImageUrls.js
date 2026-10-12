require("dotenv").config();

const mongoose = require("mongoose");

const Gallery = require("./models/Gallery");
const Leadership = require("./models/Leadership");
const Ministry = require("./models/Ministry");
const Event = require("./models/Event");
const Sermon = require("./models/Sermon");

const collections = [
  { name: "Gallery", model: Gallery, field: "imageUrl" },
  { name: "Leadership", model: Leadership, field: "imageUrl" },
  { name: "Ministry", model: Ministry, field: "imageUrl" },
  { name: "Event", model: Event, field: "imageUrl" },
  { name: "Sermon", model: Sermon, field: "thumbnailUrl" },
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  for (const collection of collections) {
    const documents = await collection.model.find(
      {},
      {
        title: 1,
        name: 1,
        [collection.field]: 1,
      }
    );

    console.log(`\n========== ${collection.name} ==========`);

    for (const document of documents) {
      console.log({
        id: document._id.toString(),
        title: document.title || document.name || "(untitled)",
        imageUrl: document[collection.field] || "(no image)",
      });
    }

    if (documents.length === 0) {
      console.log("No records found.");
    }
  }

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Inspection failed:", error.message);

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  process.exitCode = 1;
});
