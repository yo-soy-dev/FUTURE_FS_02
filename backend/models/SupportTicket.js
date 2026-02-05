import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: String,
    subject: String,
    message: {
      type: String,
      required: true,
    },
    reference: {           
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Open", "Resolved"],
      default: "Open",
    },
     adminReply: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("SupportTicket", supportTicketSchema);
