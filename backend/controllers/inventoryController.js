import Inventory from "../models/Inventory.js";
import Lead from "../models/Lead.js";
import { logActivity } from "../utils/activityLogger.js";


export const createItem = async (req, res) => {
  try {
    const { name, sku, price, quantity, status } = req.body;

    if (!name || !price || !sku) {
      return res.status(400).json({
        msg: "Name, SKU and Price required"
      });
    }


    const item = await Inventory.create({
      name,
      sku,
      price,
      quantity: quantity || 1,
      status: status || "In Stock"
    });

    await logActivity({
      user: req.user,
      action: "CREATE_INVENTORY",
      module: "Inventory",
      description: `Inventory item created: ${name}`,
      meta: { inventoryId: item._id, sku }
    });


    res.status(201).json(item);

  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};


export const getItems = async (req, res) => {
  const items = await Inventory.find().sort({ createdAt: -1 });

  const data = await Promise.all(
    items.map(async (item) => {
      const interestedCount = await Lead.countDocuments({
        source: item._id,
        status: { $in: ["New", "Contacted"] }
      });

      return {
        ...item.toObject(),
        interestedCount
      };
    })
  );

  res.json(data);
};



export const updateItem = async (req, res) => {
  const item = await Inventory.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!item) {
      return res.status(404).json({ msg: "Inventory not found" });
    }

    await logActivity({
      user: req.user,
      action: "UPDATE_INVENTORY",
      module: "Inventory",
      description: `Inventory item updated: ${item.name}`,
      meta: { inventoryId: item._id }
    });

  res.json(item);
};

export const deleteItem = async (req, res) => {
  const item = await Inventory.findByIdAndDelete(req.params.id);

  if (!item) {
      return res.status(404).json({ msg: "Inventory not found" });
    }

    await logActivity({
      user: req.user,
      action: "DELETE_INVENTORY",
      module: "Inventory",
      description: `Inventory item deleted: ${item.name}`,
      meta: { inventoryId: item._id, sku: item.sku }
    });

  res.json({ msg: "Item deleted successfully" });
};


