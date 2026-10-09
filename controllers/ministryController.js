const Ministry = require("../models/Ministry");

// GET all ministries
const getMinistries = async (req, res) => {
  try {
    const ministries = await Ministry.find().sort({ name: 1 });

    res.json(ministries);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ministries",
      error: error.message,
    });
  }
};

// GET one ministry
const getMinistryById = async (req, res) => {
  try {
    const ministry = await Ministry.findById(req.params.id);

    if (!ministry) {
      return res.status(404).json({
        message: "Ministry not found",
      });
    }

    res.json(ministry);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ministry",
      error: error.message,
    });
  }
};

// CREATE ministry
const createMinistry = async (req, res) => {
  try {
    const {
      name,
      description,
      imageUrl,
      leader,
      meetingDay,
      meetingTime,
      location,
      isActive,
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "Name and description are required",
      });
    }

    const ministry = await Ministry.create({
      name,
      description,
      imageUrl,
      leader,
      meetingDay,
      meetingTime,
      location,
      isActive,
    });

    res.status(201).json({
      message: "Ministry created successfully",
      ministry,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create ministry",
      error: error.message,
    });
  }
};

// UPDATE ministry
const updateMinistry = async (req, res) => {
  try {
    const ministry = await Ministry.findById(req.params.id);

    if (!ministry) {
      return res.status(404).json({
        message: "Ministry not found",
      });
    }

    const {
      name,
      description,
      imageUrl,
      leader,
      meetingDay,
      meetingTime,
      location,
      isActive,
    } = req.body;

    if (name !== undefined) ministry.name = name;
    if (description !== undefined) ministry.description = description;
    if (imageUrl !== undefined) ministry.imageUrl = imageUrl;
    if (leader !== undefined) ministry.leader = leader;
    if (meetingDay !== undefined) ministry.meetingDay = meetingDay;
    if (meetingTime !== undefined) ministry.meetingTime = meetingTime;
    if (location !== undefined) ministry.location = location;
    if (isActive !== undefined) ministry.isActive = isActive;

    await ministry.save();

    res.json({
      message: "Ministry updated successfully",
      ministry,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update ministry",
      error: error.message,
    });
  }
};

// DELETE ministry
const deleteMinistry = async (req, res) => {
  try {
    const ministry = await Ministry.findByIdAndDelete(req.params.id);

    if (!ministry) {
      return res.status(404).json({
        message: "Ministry not found",
      });
    }

    res.json({
      message: "Ministry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete ministry",
      error: error.message,
    });
  }
};

module.exports = {
  getMinistries,
  getMinistryById,
  createMinistry,
  updateMinistry,
  deleteMinistry,
};