const PrayerRequest = require("../models/PrayerRequest");

// GET all prayer requests
const getPrayerRequests = async (req, res) => {
  try {
    const requests = await PrayerRequest.find().sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch prayer requests",
      error: error.message,
    });
  }
};

// GET one prayer request
const getPrayerRequestById = async (req, res) => {
  try {
    const request = await PrayerRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Prayer request not found",
      });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch prayer request",
      error: error.message,
    });
  }
};

// CREATE prayer request
const createPrayerRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      request,
      isPrivate,
    } = req.body;

    if (!name || !email || !request) {
      return res.status(400).json({
        message: "Name, email and prayer request are required",
      });
    }

    const prayerRequest = await PrayerRequest.create({
      name,
      email,
      phone,
      request,
      isPrivate,
    });

    res.status(201).json({
      message: "Prayer request submitted successfully",
      prayerRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit prayer request",
      error: error.message,
    });
  }
};

// UPDATE prayer request
const updatePrayerRequest = async (req, res) => {
  try {
    const prayerRequest = await PrayerRequest.findById(req.params.id);

    if (!prayerRequest) {
      return res.status(404).json({
        message: "Prayer request not found",
      });
    }

    const {
      name,
      email,
      phone,
      request,
      isPrivate,
      status,
    } = req.body;

    if (name !== undefined) prayerRequest.name = name;
    if (email !== undefined) prayerRequest.email = email;
    if (phone !== undefined) prayerRequest.phone = phone;
    if (request !== undefined) prayerRequest.request = request;
    if (isPrivate !== undefined) prayerRequest.isPrivate = isPrivate;
    if (status !== undefined) prayerRequest.status = status;

    await prayerRequest.save();

    res.json({
      message: "Prayer request updated successfully",
      prayerRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update prayer request",
      error: error.message,
    });
  }
};

// DELETE prayer request
const deletePrayerRequest = async (req, res) => {
  try {
    const prayerRequest = await PrayerRequest.findByIdAndDelete(
      req.params.id
    );

    if (!prayerRequest) {
      return res.status(404).json({
        message: "Prayer request not found",
      });
    }

    res.json({
      message: "Prayer request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete prayer request",
      error: error.message,
    });
  }
};

module.exports = {
  getPrayerRequests,
  getPrayerRequestById,
  createPrayerRequest,
  updatePrayerRequest,
  deletePrayerRequest,
};