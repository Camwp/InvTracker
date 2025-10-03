import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getAllCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoriesController.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getSingleCategory);
router.post('/', requireAuth, createCategory);
router.put('/:id', requireAuth, updateCategory);
router.delete('/:id', requireAuth, deleteCategory);

export default router;