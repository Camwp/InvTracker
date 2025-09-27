import User from '../models/User.js';
import { createUserZ, updateUserZ } from '../validators/users.js';

// CREATE
export const createUser = async (req, res) => {
  try {
    const validatedData = createUserZ.parse(req.body); // Zod validation
    const user = new User(validatedData);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL (excluding soft-deleted)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateUser = async (req, res) => {
  try {
    const validatedData = updateUserZ.parse(req.body); // Zod validation
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      validatedData,
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found or deleted' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// SOFT DELETE
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User soft-deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};