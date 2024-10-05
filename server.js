const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();

const app = express();

// Define allowed origins
const allowedOrigins = ["https://contact-manager-qwyz.onrender.com"];

// Enable CORS with specific origin and additional configuration
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow these methods
    credentials: true, // Allow credentials
  })
);

// Preflight response for all routes
app.options("*", cors());

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
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
