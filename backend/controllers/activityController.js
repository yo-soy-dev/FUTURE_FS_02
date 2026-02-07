import Activity from "../models/Activity.js";

export const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};
