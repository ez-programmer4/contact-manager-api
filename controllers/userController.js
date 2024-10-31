const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Received registration data:", { username, email, password });

  // Check for missing fields
  if (!username || !email || !password) {
    console.log("Error: All fields are required");
    res.status(400);
    throw new Error("All fields are required");
  }

  // Check if the user already exists
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    console.log("Error: Email already in use");
    res.status(400);
    throw new Error("Email already in use");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password:", hashedPassword);

  // Create the user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    console.log("User created:", user);
    res.status(201).json({ message: "User created successfully", user });
  } else {
    console.log("Error: Failed to create user");
    res.status(400);
    throw new Error("Failed to create user");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for missing fields
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  // Find the user
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    // Generate access token
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ accessToken });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
    throw new Error("Invalid email or password");
  }
});

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.username = username || user.username;
  user.email = email || user.email;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();
  res.status(200).json({ message: "Profile updated successfully" });
});

module.exports = { registerUser, loginUser, currentUser, updateUserProfile };
