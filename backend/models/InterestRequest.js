// models/InterestRequest.js
import mongoose from "mongoose";

const interestRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },

    inventory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true
    }
  },
  { timestamps: true }
);

/**
 * 🔥 ONE PENDING request per email
 * Approved/Rejected multiple allowed
 */
interestRequestSchema.index(
  { email: 1, inventory: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["Pending", "Approved"] } }
  }
);

export default mongoose.model("InterestRequest", interestRequestSchema);
