const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");

connectDb();
const app = express();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000", // For local development
  "https://contact-manager-apii.onrender.com", // Existing deployed URL
  "https://contact-manager-qwyz.onrender.com", // Deployed React app URL
];

// CORS configuration
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Middleware to parse JSON
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
const port = process.env.PORT || 3001;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
