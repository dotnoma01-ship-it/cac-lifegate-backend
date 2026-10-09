const express = require("express");

const {
  getLeaders,
  getLeaderById,
  createLeader,
  updateLeader,
  deleteLeader,
} = require("../controllers/leadershipController");

const router = express.Router();

router.get("/", getLeaders);
router.get("/:id", getLeaderById);
router.post("/", createLeader);
router.put("/:id", updateLeader);
router.delete("/:id", deleteLeader);

module.exports = router;