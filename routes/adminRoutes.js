const express = require("express");

const {
  createAdmin,
  loginAdmin,
  getCurrentAdmin,
  changePassword,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", createAdmin);
router.post("/login", loginAdmin);
router.get("/me", authMiddleware, getCurrentAdmin);

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

module.exports = router;