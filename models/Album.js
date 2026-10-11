const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "Church",
      trim: true,
    },

    eventDate: {
      type: Date,
      default: Date.now,
    },

    images: [
      {
        imageUrl: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
          default: "",
        },

        caption: {
          type: String,
          default: "",
          trim: true,
        },
      },
    ],

    coverImage: {
      type: String,
      default: "",
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Album", albumSchema);