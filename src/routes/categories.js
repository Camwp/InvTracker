import express from 'express';
import Category from '../models/Category.js';
import Item from '../models/Item.js';
import { createCategoryZ, updateCategoryZ } from '../validators/categories.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const r = express.Router();
r.use(requireAuth);

//r.get('/', async (_req, res, next) => {
//    try {
//        const categories = await Category.find().sort({ name: 1 });
//        res.json(categories);
//    } catch (e) { next(e); }
//});

//r.get('/:id', async (req, res, next) => {
//    try {
//        const doc = await Category.findById(req.params.id);
//        if (!doc) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Category not found' } });
//        res.json(doc);
//    } catch (e) { next(e); }
//});

//r.post('/', requireAdmin, async (req, res, next) => {
//    try {
//        const data = createCategoryZ.parse(req.body);
//        const doc = await Category.create(data);
//        res.status(201).json(doc);
//    } catch (e) { next(e); }
//});

//r.put('/:id', requireAdmin, async (req, res, next) => {
//    try {
//        const data = updateCategoryZ.parse(req.body);
//        const doc = await Category.findByIdAndUpdate(req.params.id, data, { new: true });
//        if (!doc) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Category not found' } });
//        res.json(doc);
//    } catch (e) { next(e); }
//});

//r.delete('/:id', requireAdmin, async (req, res, next) => {
//    try {
//        const count = await Item.countDocuments({ categoryId: req.params.id });
//        if (count > 0) {
//            return res.status(409).json({ error: { code: 'DELETE_CONFLICT', message: 'Category has items' } });
//        }
//        const out = await Category.findByIdAndDelete(req.params.id);
//        if (!out) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Category not found' } });
//        res.status(204).end();
//    } catch (e) { next(e); }
//});

export default r;
