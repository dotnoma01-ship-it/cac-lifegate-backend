const express = require("express");

const {
  getSermons,
  getSermonById,
  createSermon,
  updateSermon,
  deleteSermon,
} = require("../controllers/sermonController");

const router = express.Router();

router.get("/", getSermons);
router.get("/:id", getSermonById);
router.post("/", createSermon);
router.put("/:id", updateSermon);
router.delete("/:id", deleteSermon);

module.exports = router;