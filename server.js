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

// CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow if the origin is in the list or it's not provided (like with curl or Postman)
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

// Enable CORS
app.use(cors(corsOptions));

// Handle preflight requests globally
app.options("*", cors(corsOptions));

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
