const mongoose = require("mongoose");

const prayerRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    request: {
      type: String,
      required: true,
      trim: true,
    },

    isPrivate: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Prayed For", "Archived"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PrayerRequest", prayerRequestSchema);