import express from 'express';
import Item from '../models/Item.js';
import Category from '../models/Category.js';
import Location from '../models/Location.js';
import Note from '../models/Note.js';
import { createItemZ, updateItemZ } from '../validators/items.js';
import { requireAuth } from '../middleware/auth.js';
import mongoose from 'mongoose';

const r = express.Router();
r.use(requireAuth);

//r.get('/', async (req, res, next) => {
//    try {
//        const { q, categoryId, locationId, status, lowStock } = req.query;
//        const filter = {};
//        if (q) filter.name = { $regex: q, $options: 'i' };
//        if (categoryId && mongoose.isValidObjectId(categoryId)) filter.categoryId = categoryId;
//        if (locationId && mongoose.isValidObjectId(locationId)) filter.locationId = locationId;
//        if (status) filter.status = status;
//        if (lowStock === 'true') filter.$expr = { $lte: ['$qtyOnHand', '$reorderLevel'] };
//
//        const items = await Item.find(filter).sort({ updatedAt: -1 });
//        res.json(items);
//    } catch (e) { next(e); }
//});

//r.get('/:id', async (req, res, next) => {
//    try {
//        const doc = await Item.findById(req.params.id);
//        if (!doc) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
//        res.json(doc);
//    } catch (e) { next(e); }
//});

//r.post('/', async (req, res, next) => {
//    try {
//        const data = createItemZ.parse(req.body);
//
//        const [cat, loc] = await Promise.all([
//            Category.findById(data.categoryId),
//            Location.findById(data.locationId),
//        ]);
//        if (!cat) return res.status(400).json({ error: { code: 'BAD_REF', message: 'Invalid categoryId' } });
//        if (!loc) return res.status(400).json({ error: { code: 'BAD_REF', message: 'Invalid locationId' } });
//
//        const doc = await Item.create(data);
//        res.status(201).json(doc);
//    } catch (e) { next(e); }
//});

//r.put('/:id', async (req, res, next) => {
//    try {
//        const data = updateItemZ.parse(req.body);
//
//        if (data.categoryId && !(await Category.findById(data.categoryId))) {
//            return res.status(400).json({ error: { code: 'BAD_REF', message: 'Invalid categoryId' } });
//        }
//        if (data.locationId && !(await Location.findById(data.locationId))) {
//            return res.status(400).json({ error: { code: 'BAD_REF', message: 'Invalid locationId' } });
//        }
//
//        const doc = await Item.findByIdAndUpdate(req.params.id, data, { new: true });
//        if (!doc) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
//        res.json(doc);
//    } catch (e) { next(e); }
//});

//r.delete('/:id', async (req, res, next) => {
//    try {
//        const item = await Item.findById(req.params.id);
//        if (!item) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
//        await Promise.all([
//            Note.deleteMany({ itemId: item._id }),
//            item.deleteOne()
//        ]);
//        res.status(204).end();
//    } catch (e) { next(e); }
//});

export default r;
