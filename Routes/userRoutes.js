const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  updateUserProfile,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

// User registration endpoint
router.post("/register", registerUser);

// User login endpoint
router.post("/login", loginUser);

// Get current user data
router.get("/current", validateToken, currentUser); // Ensure this is protected by the token

// Update user profile
router.put("/profile", validateToken, updateUserProfile);

module.exports = router;
