import Item from '../models/item.js';

// POST /items - Create item
export const createItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /items/:id - Update item
export const updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /items?q=&categoryId=&locationId=&status=&lowStock=true
export const getItems = async (req, res) => {
  try {
    const { q, categoryId, locationId, status, lowStock } = req.query;

    let filter = {};

    if (q) {
      filter.name = { $regex: q, $options: 'i' }; // Capital sensitive search
    }
    if (categoryId) filter.categoryId = categoryId;
    if (locationId) filter.locationId = locationId;
    if (status) filter.status = status;
    if (lowStock === 'true') {
      filter.$expr = { $lt: ["$qtyOnHand", "$reorderLevel"] };
    }

    const items = await Item.find(filter);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /items/:id - Get an item
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /items/:id - Erase item
export const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
