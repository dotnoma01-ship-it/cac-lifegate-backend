const express = require("express");

const {
  getMinistries,
  getMinistryById,
  createMinistry,
  updateMinistry,
  deleteMinistry,
} = require("../controllers/ministryController");

const router = express.Router();

router.get("/", getMinistries);
router.get("/:id", getMinistryById);
router.post("/", createMinistry);
router.put("/:id", updateMinistry);
router.delete("/:id", deleteMinistry);

module.exports = router;