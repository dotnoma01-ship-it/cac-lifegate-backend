const Sermon = require("../models/Sermon");

// GET all sermons
const getSermons = async (req, res) => {
  try {
    const sermons = await Sermon.find().sort({ date: -1 });

    res.json(sermons);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sermons",
      error: error.message,
    });
  }
};

// GET one sermon
const getSermonById = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);

    if (!sermon) {
      return res.status(404).json({
        message: "Sermon not found",
      });
    }

    res.json(sermon);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sermon",
      error: error.message,
    });
  }
};

// CREATE sermon
const createSermon = async (req, res) => {
  try {
    const {
      title,
      preacher,
      description,
      date,
      videoUrl,
      audioUrl,
      thumbnailUrl,
      category,
      isFeatured,
    } = req.body;

    if (!title || !preacher || !date) {
      return res.status(400).json({
        message: "Title, preacher and date are required",
      });
    }

    const sermon = await Sermon.create({
      title,
      preacher,
      description,
      date,
      videoUrl,
      audioUrl,
      thumbnailUrl,
      category,
      isFeatured,
    });

    res.status(201).json({
      message: "Sermon created successfully",
      sermon,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create sermon",
      error: error.message,
    });
  }
};

// UPDATE sermon
const updateSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);

    if (!sermon) {
      return res.status(404).json({
        message: "Sermon not found",
      });
    }

    const {
      title,
      preacher,
      description,
      date,
      videoUrl,
      audioUrl,
      thumbnailUrl,
      category,
      isFeatured,
    } = req.body;

    if (title !== undefined) sermon.title = title;
    if (preacher !== undefined) sermon.preacher = preacher;
    if (description !== undefined) sermon.description = description;
    if (date !== undefined) sermon.date = date;
    if (videoUrl !== undefined) sermon.videoUrl = videoUrl;
    if (audioUrl !== undefined) sermon.audioUrl = audioUrl;
    if (thumbnailUrl !== undefined) sermon.thumbnailUrl = thumbnailUrl;
    if (category !== undefined) sermon.category = category;
    if (isFeatured !== undefined) sermon.isFeatured = isFeatured;

    await sermon.save();

    res.json({
      message: "Sermon updated successfully",
      sermon,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update sermon",
      error: error.message,
    });
  }
};

// DELETE sermon
const deleteSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findByIdAndDelete(req.params.id);

    if (!sermon) {
      return res.status(404).json({
        message: "Sermon not found",
      });
    }

    res.json({
      message: "Sermon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete sermon",
      error: error.message,
    });
  }
};

module.exports = {
  getSermons,
  getSermonById,
  createSermon,
  updateSermon,
  deleteSermon,
};