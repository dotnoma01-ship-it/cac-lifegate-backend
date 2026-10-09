const Gallery = require("../models/Gallery");

// GET all gallery items
const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ date: -1 });

    res.json(gallery);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gallery",
      error: error.message,
    });
  }
};

// GET one gallery item
const getGalleryItemById = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Gallery item not found",
      });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gallery item",
      error: error.message,
    });
  }
};

// CREATE gallery item
const createGalleryItem = async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrl,
      category,
      event,
      date,
    } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({
        message: "Title and image URL are required",
      });
    }

    const item = await Gallery.create({
      title,
      description,
      imageUrl,
      category,
      event,
      date,
    });

    res.status(201).json({
      message: "Gallery item created successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create gallery item",
      error: error.message,
    });
  }
};

// UPDATE gallery item
const updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Gallery item not found",
      });
    }

    const {
      title,
      description,
      imageUrl,
      category,
      event,
      date,
    } = req.body;

    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;
    if (imageUrl !== undefined) item.imageUrl = imageUrl;
    if (category !== undefined) item.category = category;
    if (event !== undefined) item.event = event;
    if (date !== undefined) item.date = date;

    await item.save();

    res.json({
      message: "Gallery item updated successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update gallery item",
      error: error.message,
    });
  }
};

// DELETE gallery item
const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Gallery item not found",
      });
    }

    res.json({
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete gallery item",
      error: error.message,
    });
  }
};

module.exports = {
  getGallery,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};