const mongoose = require("mongoose");

const constantSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: [true, "please provide the contact name"] },
    email: {
      type: String,
      required: [true, "please provide the contact email"],
    },
    phone: {
      type: String,
      required: [true, "please provide the contact phone"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", constantSchema);
