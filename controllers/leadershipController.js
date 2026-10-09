const Leadership = require("../models/Leadership");

// GET all leaders
const getLeaders = async (req, res) => {
  try {
    const leaders = await Leadership.find().sort({ order: 1 });

    res.json(leaders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch leadership",
      error: error.message,
    });
  }
};

// GET one leader
const getLeaderById = async (req, res) => {
  try {
    const leader = await Leadership.findById(req.params.id);

    if (!leader) {
      return res.status(404).json({
        message: "Leader not found",
      });
    }

    res.json(leader);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch leader",
      error: error.message,
    });
  }
};

// CREATE leader
const createLeader = async (req, res) => {
  try {
    const {
      name,
      position,
      bio,
      imageUrl,
      email,
      phone,
      order,
      isActive,
    } = req.body;

    if (!name || !position) {
      return res.status(400).json({
        message: "Name and position are required",
      });
    }

    const leader = await Leadership.create({
      name,
      position,
      bio,
      imageUrl,
      email,
      phone,
      order,
      isActive,
    });

    res.status(201).json({
      message: "Leader created successfully",
      leader,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create leader",
      error: error.message,
    });
  }
};

// UPDATE leader
const updateLeader = async (req, res) => {
  try {
    const leader = await Leadership.findById(req.params.id);

    if (!leader) {
      return res.status(404).json({
        message: "Leader not found",
      });
    }

    const {
      name,
      position,
      bio,
      imageUrl,
      email,
      phone,
      order,
      isActive,
    } = req.body;

    if (name !== undefined) leader.name = name;
    if (position !== undefined) leader.position = position;
    if (bio !== undefined) leader.bio = bio;
    if (imageUrl !== undefined) leader.imageUrl = imageUrl;
    if (email !== undefined) leader.email = email;
    if (phone !== undefined) leader.phone = phone;
    if (order !== undefined) leader.order = order;
    if (isActive !== undefined) leader.isActive = isActive;

    await leader.save();

    res.json({
      message: "Leader updated successfully",
      leader,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update leader",
      error: error.message,
    });
  }
};

// DELETE leader
const deleteLeader = async (req, res) => {
  try {
    const leader = await Leadership.findByIdAndDelete(req.params.id);

    if (!leader) {
      return res.status(404).json({
        message: "Leader not found",
      });
    }

    res.json({
      message: "Leader deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete leader",
      error: error.message,
    });
  }
};

module.exports = {
  getLeaders,
  getLeaderById,
  createLeader,
  updateLeader,
  deleteLeader,
};