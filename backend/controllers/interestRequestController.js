import InterestRequest from "../models/InterestRequest.js";
import Lead from "../models/Lead.js";
import User from "../models/User.js";
import Inventory from "../models/Inventory.js";

/**
 * CLIENT → CREATE INTEREST REQUEST
 */
export const createInterestRequest = async (req, res) => {
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

  res.json({
    msg: "Interest request sent to admin",
    request
  });
};


/**
 * =========================
 * CLIENT → MARK / UPDATE INTEREST
 * =========================
 */
export const markInterest = async (req, res) => {
  const { inventoryId } = req.body;
  const email = req.user.email;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "User not found" });

  // 🔁 Check existing pending request
  let request = await InterestRequest.findOne({
    email,
    inventory: inventoryId,
    status: { $in: ["Pending", "Approved"] }
  });

  if (request) {
    // overwrite inventory
    request.inventory = inventoryId;
    await request.save();

    return res.json({
      msg: "Interest updated. Waiting for admin approval",
      request
    });
  }

  // 🆕 Create new request
  request = await InterestRequest.create({
    name: user.name,
    email,
    inventory: inventoryId
  });

  res.json({
    msg: "Interest sent to admin for approval",
    request
  });
};

/**
 * =========================
 * ADMIN → GET PENDING REQUESTS
 * =========================
 */
export const getPendingRequests = async (req, res) => {
  const requests = await InterestRequest.find({ status: "Pending" })
    .populate("inventory", "name price");

  res.json(requests);
};

/**
 * =========================
 * ADMIN → APPROVE REQUEST & CREATE/UPDATE LEAD
 * =========================
 */
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

  // 🔥 One lead per client
  let lead = await Lead.findOne({ email: request.email, source: inventory._id });

  // if (lead) {
  //   // lead.source = request.inventory;
  //   lead.status = "Approved";
  //   await lead.save();
  // } else {
  //   lead = await Lead.create({
  //     name: request.name,
  //     email: request.email,
  //     source: inventory._id,
  //     status: "Approved"
  //   });
  // }

  if (!lead) {
  lead = await Lead.create({
    name: request.name,
    email: request.email,
    source: inventory._id, // <-- use inventory._id
    status: "New"
  });
} else {
  // update status if needed
  lead.status = "New";
  await lead.save();
}

  // approve this request
  request.status = "Approved";
  await request.save();

  // ❌ reject all other requests of same user
  await InterestRequest.updateMany(
    { email: request.email, _id: { $ne: request._id } },
    { status: "Rejected" }
  );

  res.json({
    msg: "Lead created & other interests closed",
    lead
  });
};

/**
 * =========================
 * ADMIN → REJECT REQUEST
 * =========================
 */
export const rejectRequest = async (req, res) => {
  const request = await InterestRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ msg: "Request not found" });

  request.status = "Rejected";
  await request.save();

  res.json({ msg: "Interest request rejected" });
};
