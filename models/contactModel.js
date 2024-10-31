// src/models/contactModel.js
const mongoose = require("mongoose"); // Import mongoose

const constantSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    favorite: { type: Boolean, default: false },
    group: { type: String }, // New field for grouping contacts
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", constantSchema); // Create the model

module.exports = Contact; // Export the model
