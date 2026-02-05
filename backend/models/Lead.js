import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    // 🔥 INVENTORY RELATION (VERY IMPORTANT)
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Converted", "Rejected"],
      default: "New"
    },

    notes: String
  },
  { timestamps: true }
);

leadSchema.index({ email: 1, source: 1 }, { unique: true });

export default mongoose.model("Lead", leadSchema);
