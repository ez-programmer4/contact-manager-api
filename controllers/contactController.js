const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Get all contacts
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

// Get a single contact by ID
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

// Create a new contact
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  res.status(201).json(contact);
});

// Update an existing contact
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error(
      "User doesn't have permission to update other users' contacts"
    );
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedContact);
});

// Delete a contact
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error(
      "User doesn't have permission to delete other users' contacts"
    );
  }

  await contact.deleteOne({ _id: req.params.id });
  res.status(204).json({ message: "Contact deleted" });
});

// Import contacts from CSV
const importContacts = asyncHandler(async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        // Save imported contacts
        await Contact.insertMany(
          results.map((contact) => ({ ...contact, user_id: req.user.id }))
        );
        // Optionally delete the uploaded file
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
        res.status(200).json({ message: "Contacts imported successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error importing contacts", error });
      }
    })
    .on("error", (error) => {
      res.status(500).json({ message: "Error reading CSV file", error });
    });
});

// Export contacts to CSV
const exportContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  const csvData = contacts
    .map((contact) => `${contact.name},${contact.email},${contact.phone}`)
    .join("\n");

  res.header("Content-Type", "text/csv");
  res.attachment("contacts.csv");
  res.send(csvData);
});

// Exporting the CRUD operations and upload middleware
module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  importContacts,
  exportContacts,
  upload, // Export the upload middleware
};
