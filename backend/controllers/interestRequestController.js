import InterestRequest from "../models/InterestRequest.js";
import Lead from "../models/Lead.js";
import User from "../models/User.js";
import Inventory from "../models/Inventory.js";
import { logActivity } from "../utils/activityLogger.js";


export const createInterestRequest = async (req, res) => {
  try {
    const { inventoryId } = req.body;
    const email = req.user.email;

    if (!inventoryId) {
      return res.status(400).json({ msg: "Inventory ID is required" });
    }


    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const existing = await InterestRequest.findOne({
      email,
      inventory: inventoryId,
      status: { $in: ["Pending", "Approved"] }
    });

    if (existing) {
      return res.status(400).json({
        msg: "You already have a pending interest request"
      });
    }

    const request = await InterestRequest.create({
      name: user.name,
      email,
      inventory: inventoryId
    });

    await logActivity({
      user: req.user,
      action: "CREATE_INTEREST",
      module: "Interest",
      description: `Interest requested for inventory ${inventoryId}`,
      meta: { inventoryId }
    });


    res.json({
      msg: "Interest request sent to admin",
      request
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};



export const markInterest = async (req, res) => {
  const { inventoryId } = req.body;
  const email = req.user.email;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  let request = await InterestRequest.findOne({
    email,
    inventory: inventoryId,
    status: { $in: ["Pending", "Approved"] }
  });

  if (request) {
    request.inventory = inventoryId;
    await request.save();

    return res.json({
      msg: "Interest updated. Waiting for admin approval",
      request
    });
  }

  request = await InterestRequest.create({
    name: user.name,
    email,
    inventory: inventoryId
  });

  await logActivity({
    user: req.user,
    action: "UPDATE_INTEREST",
    module: "Interest",
    description: `Interest updated for inventory ${inventoryId}`,
    meta: { inventoryId }
  });


  res.json({
    msg: "Interest sent to admin for approval",
    request
  });
};


export const getPendingRequests = async (req, res) => {
  const requests = await InterestRequest.find({ status: "Pending" })
    .populate("inventory", "name price");

  res.json(requests);
};

export const approveRequestAndCreateLead = async (req, res) => {
  const request = await InterestRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ msg: "Request not found" });

  if (request.status === "Approved") {
    return res.status(400).json({ msg: "Request already approved" });
  }

  const inventory = await Inventory.findById(request.inventory);
  if (!inventory) return res.status(404).json({ msg: "Inventory not found" });

  const approvedLeadsCount = await Lead.countDocuments({
    source: inventory._id,
    status: { $in: ["New", "Contacted", "Converted"] }
  });

  if (approvedLeadsCount >= inventory.quantity) {
    return res.status(400).json({ msg: "Inventory fully booked" });
  }

  let lead = await Lead.findOne({ email: request.email, source: inventory._id });

  if (!lead) {
    lead = await Lead.create({
      name: request.name,
      email: request.email,
      source: inventory._id, 
      status: "New"
    });
  } else {
    lead.status = "New";
    await lead.save();
  }

  request.status = "Approved";
  await request.save();

  await logActivity({
    user: req.user,
    action: "APPROVE_INTEREST",
    module: "Interest",
    description: `Interest approved & lead created for ${request.email}`,
    meta: {
      requestId: request._id,
      leadId: lead._id,
      inventoryId: inventory._id
    }
  });


  res.json({
    msg: "Lead created & other interests closed",
    lead
  });
};

export const rejectRequest = async (req, res) => {
  const request = await InterestRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ msg: "Request not found" });

  request.status = "Rejected";
  await request.save();

  await logActivity({
    user: req.user,
    action: "REJECT_INTEREST",
    module: "Interest",
    description: `Interest rejected for ${request.email}`,
    meta: {
      requestId: request._id,
      inventoryId: request.inventory
    }
  });


  res.json({ msg: "Interest request rejected" });
};
