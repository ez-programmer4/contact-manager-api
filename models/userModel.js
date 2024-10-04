const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the username"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide the email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide the password"],
    },
  },
  {
    timestamps: true,
  }
);

// Create a User model
const User = mongoose.model("User", userSchema);

module.exports = User;
