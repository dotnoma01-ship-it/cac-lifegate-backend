const express = require("express");

const {
  getHymns,
  getHymnByNumber,
  createHymn,
  updateHymn,
  deleteHymn,
} = require("../controllers/hymnController");

const router = express.Router();

// Get all hymns
router.get("/", getHymns);

// Get one hymn by its hymn number (public hymn viewer)
router.get("/:number", getHymnByNumber);

// Create a hymn
router.post("/", createHymn);

// Update a hymn using its MongoDB ID
router.put("/:id", updateHymn);

// Delete a hymn using its MongoDB ID
router.delete("/:id", deleteHymn);

module.exports = router;