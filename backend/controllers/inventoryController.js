import Inventory from "../models/Inventory.js";
import Lead from "../models/Lead.js";

// CREATE
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



// UPDATE
export const updateItem = async (req, res) => {
  const item = await Inventory.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(item);
};

// DELETE
export const deleteItem = async (req, res) => {
  await Inventory.findByIdAndDelete(req.params.id);
  res.json({ msg: "Item deleted" });
};


