import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    userName: String,
    userEmail: String,
    role: String,

    action: {
      type: String,
      required: true, 
    },

    module: {
      type: String,
      required: true, 
    },

    description: String,

    meta: Object, 
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
