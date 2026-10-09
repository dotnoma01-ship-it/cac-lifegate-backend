const ContactMessage = require("../models/ContactMessage");

// GET all contact messages
const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({
      createdAt: -1,
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch contact messages",
      error: error.message,
    });
  }
};

// GET one contact message
const getContactMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch contact message",
      error: error.message,
    });
  }
};

// CREATE contact message
const createContactMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message:
          "Name, email, subject and message are required",
      });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully",
      contactMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// UPDATE contact message
const updateContactMessage = async (req, res) => {
  try {
    const contactMessage = await ContactMessage.findById(
      req.params.id
    );

    if (!contactMessage) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    const {
      name,
      email,
      phone,
      subject,
      message,
      status,
    } = req.body;

    if (name !== undefined) contactMessage.name = name;
    if (email !== undefined) contactMessage.email = email;
    if (phone !== undefined) contactMessage.phone = phone;
    if (subject !== undefined) contactMessage.subject = subject;
    if (message !== undefined) contactMessage.message = message;
    if (status !== undefined) contactMessage.status = status;

    await contactMessage.save();

    res.json({
      message: "Contact message updated successfully",
      contactMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update contact message",
      error: error.message,
    });
  }
};

// DELETE contact message
const deleteContactMessage = async (req, res) => {
  try {
    const contactMessage = await ContactMessage.findByIdAndDelete(
      req.params.id
    );

    if (!contactMessage) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    res.json({
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete contact message",
      error: error.message,
    });
  }
};

module.exports = {
  getContactMessages,
  getContactMessageById,
  createContactMessage,
  updateContactMessage,
  deleteContactMessage,
};