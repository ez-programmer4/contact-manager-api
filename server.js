const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();

const app = express();

// Load allowed origins from environment variables
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

// Enable CORS with specific origin and additional options
app.use(
  cors({
    origin:
      allowedOrigins.length > 0 ? allowedOrigins : ["http://localhost:3000"], // Allow local origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

const port = process.env.PORT || 3001; // Use the port defined in the environment variable
app.use(express.json());

// Route definitions
app.use("/api/contacts", require("./Routes/contactRoutes"));
app.use("/api/user", require("./Routes/userRoutes"));

// Error handling middleware
app.use(errorHandler);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  // Bind to 0.0.0.0
  console.log(`Server is running on port ${port}`);
});
