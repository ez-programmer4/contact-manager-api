const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  updateUserProfile,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser); // Ensure this matches the endpoint
router.post("/login", loginUser);
router.get("/current", currentUser);
router.put("/profile", validateToken, updateUserProfile);

module.exports = router;
