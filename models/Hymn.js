const mongoose = require("mongoose");

const hymnSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "Worship",
      trim: true,
    },

    lyrics: {
      type: String,
      required: true,
    },

    audioUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hymn", hymnSchema);