const express = require("express");

const {
  getPrayerRequests,
  getPrayerRequestById,
  createPrayerRequest,
  updatePrayerRequest,
  deletePrayerRequest,
} = require("../controllers/prayerController");

const router = express.Router();

router.get("/", getPrayerRequests);
router.get("/:id", getPrayerRequestById);
router.post("/", createPrayerRequest);
router.put("/:id", updatePrayerRequest);
router.delete("/:id", deletePrayerRequest);

module.exports = router;