import Category from '../models/Category.js';
import { createCategoryValidator, updateCategoryValidator } from '../validators/categories.js';

// GET all
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single
export const getSingleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST
export const createCategory = async (req, res) => {
  try {
    const validatedData = createCategoryValidator.parse(req.body);
    const category = await Category.create(validatedData);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT
export const updateCategory = async (req, res) => {
  try {
    const validatedData = updateCategoryValidator.parse(req.body);
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};