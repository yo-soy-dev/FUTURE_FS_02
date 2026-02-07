import SupportTicket from "../models/SupportTicket.js";
import { logActivity } from "../utils/activityLogger.js";



export const createSupportTicket = async (req, res) => {
  try {
    const { subject, message, reference } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const ticket = await SupportTicket.create({
      userId: req.user.id,
      email: req.user.email,
      subject,
      message,
      reference,
    });

    await logActivity({
      user: req.user || null,
      action: "CREATE_TICKET",
      module: "Support",
      description: `Support ticket created by ${req.user.email}`,
      meta: { ticketId: ticket._id },
    });


    res.status(201).json({
      message: "Support ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: "Support request failed" });
  }
};


export const getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const resolveTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const ticket = await SupportTicket.findByIdAndUpdate(
      id,
      { status: "Resolved", adminReply: reply || "Resolved by admin" },
      { new: true }
    );


    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await logActivity({
      user: req.user || {
        name: "Devansh Tiwari",
        email: "admin@gmail.com",
        role: "admin"
      },
      action: "RESOLVE_TICKET",
      module: "Support",
      description: `Ticket resolved for ${ticket.email}`,
      meta: { ticketId: ticket._id },
    });


    res.json({
      message: "Ticket resolved successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to resolve ticket" });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};
