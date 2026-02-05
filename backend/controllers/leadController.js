import InterestRequest from "../models/InterestRequest.js";
import Inventory from "../models/Inventory.js";
import Lead from "../models/Lead.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Email regex
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Allowed status values
const validStatus = ["New", "Contacted", "Converted", "Rejected"];

// CREATE LEAD
export const createLead = async (req, res) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    const { email, source, notes, status } = req.body;
    if (!email) return res.status(400).json({ msg: "Name and Email required" });

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ msg: "Client has not registered yet. Please ask the client to register first." });
    }

    const inventory = await Inventory.findById(source)
    // .session(session);
    if (!inventory) return res.status(404).json({ msg: "Inventory not found" });

    // Count all leads for this inventory (New, Contacted, Converted)
    const existingLeadsCount = await Lead.countDocuments({
      source,
      status: { $in: ["New", "Contacted", "Converted"] }
    })
    // .session(session);

    if (existingLeadsCount >= inventory.quantity) {
      // await session.abortTransaction();
      // session.endSession();
      return res.status(400).json({ msg: "Inventory fully booked" });
    }


    const existingLead = await Lead.findOne({ email, source })
    // .session(session);
    if (existingLead) {
      // await session.abortTransaction();
      // session.endSession();
      return res.status(400).json({ msg: "Lead already exists for this inventory" });
    }

    const leadStatus = validStatus.includes(status) ? status : "New";

    const lead = await Lead.create(
      {
        name: existingUser.name,
        email,
        source,
        notes,
        status: leadStatus
      }, 
      // { session }
    );

    // const existingLead = await Lead.findOne({ email, source });
    // if (existingLead) {
    //   return res.status(400).json({
    //     msg: "❌ Lead already exists with this email"
    //   });
    // }

    // // 🆕 ONLY create new lead
    // const lead = await Lead.create({
    //   name: existingUser.name,
    //   email,
    //   source,
    //   notes,
    //   status: "New"
    // });

    res.status(201).json({ msg: "Lead created successfully", lead });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// GET ALL LEADS
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// UPDATE LEAD
// UPDATE LEAD
export const updateLead = async (req, res) => {
  try {
    const { name, status } = req.body; // only allow name & status update
    const leadId = req.params.id;

    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ msg: "Lead not found" });

    // Validate status
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    // Update lead fields
    if (name) lead.name = name;
    if (status) lead.status = status;
    await lead.save();

    // Sync Users collection (update name only, email & password untouched)
    if (name) {
      await User.updateOne(
        { email: lead.email }, // match by email
        { name }               // update name only
      );
    }

    res.json({ msg: "Lead updated successfully", lead });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};


// DELETE LEAD
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ msg: "Lead not found" });
    }

    // await lead.deleteOne();

    // 🔥 Related InterestRequest reset कर दो
    await InterestRequest.deleteMany({
      email: lead.email,
      inventory: lead.source
    });

    res.json({ msg: "Lead deleted & related interest reset successfully" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


export const getLeadByEmail = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const leads = await Lead.find({ email: req.user.email });
    if (!leads) return res.json(null);
    res.json(leads);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET /leads/inventory/:id
export const getInterestedUsersByInventory = async (req, res) => {
  const leads = await Lead.find({
    source: req.params.id,
    status: { $in: ["New", "Contacted"] }
  }).sort({ createdAt: -1 });

  res.json(leads);
};

export const getLeadsByInventory = async (req, res) => {
  const { inventoryId } = req.params;
  const leads = await Lead.find({ source: inventoryId })
    .select("name email status");
  res.json(leads);
};
