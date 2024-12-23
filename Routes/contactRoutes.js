const express = require("express");
const router = express.Router();
const {
  getContact,
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  exportContacts,
  importContacts,
  upload, // Import the upload middleware
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);

// Route to handle GET, POST, PUT, DELETE for contacts
router
  .route("/")
  .get(getContacts) // Retrieve all contacts
  .post(createContact); // Create a new contact

router
  .route("/:id")
  .get(getContact) // Retrieve a specific contact by ID
  .put(updateContact) // Update a specific contact by ID
  .delete(deleteContact); // Delete a specific contact by ID

router.post("/import", upload.single("file"), importContacts); // Use upload middleware
router.post("/export", exportContacts);

module.exports = router;
