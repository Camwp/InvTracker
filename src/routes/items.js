import express from 'express';
import { createItemZ, updateItemZ } from '../validators/items.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/auth.js';
import {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
} from '../controllers/itemController.js';


const router = express.Router();

router.get('/', getItems)

router.get('/:id', getItemById)

router.post('/', requireAuth, requireAdmin, createItem)

router.put('/:id', requireAuth, requireAdmin, updateItem)

router.delete('/:id', requireAuth, requireAdmin, deleteItem)

export default router;
