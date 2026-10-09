const mongoose = require("mongoose");
const Hymn = require("../models/Hymn");

// GET all hymns
const getHymns = async (req, res) => {
  try {
    const hymns = await Hymn.find().sort({ number: 1 });
    res.json(hymns);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch hymns",
      error: error.message,
    });
  }
};

// GET one hymn by hymn number
const getHymnByNumber = async (req, res) => {
  try {
    const number = Number(req.params.number);

    if (!Number.isInteger(number) || number < 1) {
      return res.status(400).json({
        message: "Invalid hymn number",
      });
    }

    const hymn = await Hymn.findOne({ number });

    if (!hymn) {
      return res.status(404).json({
        message: "Hymn not found",
      });
    }

    res.json(hymn);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch hymn",
      error: error.message,
    });
  }
};

// CREATE a hymn
const createHymn = async (req, res) => {
  try {
    const { number, title, category, lyrics, audioUrl } = req.body;

    if (
      number === undefined ||
      number === null ||
      number === "" ||
      !Number.isInteger(Number(number)) ||
      Number(number) < 1 ||
      !title?.trim() ||
      !lyrics?.trim()
    ) {
      return res.status(400).json({
        message: "A valid hymn number, title and lyrics are required",
      });
    }

    const existingHymn = await Hymn.findOne({
      number: Number(number),
    });

    if (existingHymn) {
      return res.status(409).json({
        message: "A hymn with this number already exists",
      });
    }

    const hymn = await Hymn.create({
      number: Number(number),
      title: title.trim(),
      category,
      lyrics,
      audioUrl,
    });

    res.status(201).json({
      message: "Hymn created successfully",
      hymn,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create hymn",
      error: error.message,
    });
  }
};

// UPDATE a hymn using its MongoDB ID
const updateHymn = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid hymn ID",
      });
    }

    const hymn = await Hymn.findById(id);

    if (!hymn) {
      return res.status(404).json({
        message: "Hymn not found",
      });
    }

    const { number, title, category, lyrics, audioUrl } = req.body;

    // Allow editing the hymn number without creating duplicates.
    if (number !== undefined) {
      const parsedNumber = Number(number);

      if (!Number.isInteger(parsedNumber) || parsedNumber < 1) {
        return res.status(400).json({
          message: "Hymn number must be a positive integer",
        });
      }

      const duplicate = await Hymn.findOne({
        number: parsedNumber,
        _id: { $ne: hymn._id },
      });

      if (duplicate) {
        return res.status(409).json({
          message: "Another hymn already uses this number",
        });
      }

      hymn.number = parsedNumber;
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Hymn title cannot be empty",
        });
      }

      hymn.title = title.trim();
    }

    if (category !== undefined) hymn.category = category;
    if (lyrics !== undefined) hymn.lyrics = lyrics;
    if (audioUrl !== undefined) hymn.audioUrl = audioUrl;

    await hymn.save();

    res.json({
      message: "Hymn updated successfully",
      hymn,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update hymn",
      error: error.message,
    });
  }
};

// DELETE a hymn using its MongoDB ID
const deleteHymn = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid hymn ID",
      });
    }

    const hymn = await Hymn.findByIdAndDelete(id);

    if (!hymn) {
      return res.status(404).json({
        message: "Hymn not found",
      });
    }

    res.json({
      message: "Hymn deleted successfully",
      hymn,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete hymn",
      error: error.message,
    });
  }
};

module.exports = {
  getHymns,
  getHymnByNumber,
  createHymn,
  updateHymn,
  deleteHymn,
};