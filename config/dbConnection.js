const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
      // The `useNewUrlParser` and `useUnifiedTopology` options are no longer needed
      // Other options can be added here
      // ssl: true // Uncomment if needed, though it's typically enabled by default for Atlas
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit the process if connection fails
  }
};

module.exports = connectDb;
