import Activity from "../models/Activity.js";

export const logActivity = async ({ user, action, module, description, meta = {} }) => {
  try {
    if (!action || !module) {
      console.warn("Missing action/module for activity", { user, action, module });
      return;
    }

    const isSystem = !user;

    console.log("Logging activity:", { user, action, module, description, meta });

    await Activity.create({
      userId: user?.id || null,
      userName: isSystem ? "System" : user.name || "Unknown",
      userEmail: isSystem ? "system@internal" : user.email || "unknown@system",
      role: isSystem ? "system" : user.role || "user",
      action,
      module,
      description: description || "",
      meta,
    });
  } catch (err) {
    console.error("Activity log failed:", err);
  }
};
