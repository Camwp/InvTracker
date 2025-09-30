import express from 'express';
import { createItemZ, updateItemZ } from '../validators/items.js';
import { requireAuth } from '../middleware/auth.js';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} from '../controllers/itemController.js';


const router = express.Router();

router.get('/items', getItems)
router.get('/items/:id', getItemById)

router.post('/items', requireAuth, createItem)

router.put('/items/:id', requireAuth, updateItem)

router.delete('/item/:id', requireAuth, deleteItem)

export default router;
