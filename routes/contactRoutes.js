const express = require("express");

const {
  getContactMessages,
  getContactMessageById,
  createContactMessage,
  updateContactMessage,
  deleteContactMessage,
} = require("../controllers/contactController");

const router = express.Router();

router.get("/", getContactMessages);
router.get("/:id", getContactMessageById);
router.post("/", createContactMessage);
router.put("/:id", updateContactMessage);
router.delete("/:id", deleteContactMessage);

module.exports = router;