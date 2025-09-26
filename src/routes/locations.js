import express from 'express';
import Location from '../models/Location.js';
import Item from '../models/Item.js';
import { createLocationZ, updateLocationZ } from '../validators/locations.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const r = express.Router();
r.use(requireAuth);

//r.get('/', async (_req, res, next) => {
//    try {
//        const locs = await Location.find().sort({ name: 1 });
//        res.json(locs);
//    } catch (e) { next(e); }
//});

//r.get('/:id', async (req, res, next) => {
//    try {
//        const doc = await Location.findById(req.params.id);
//        if (!doc) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Location not found' } });
//        res.json(doc);
//    } catch (e) { next(e); }
//});

//r.post('/', requireAdmin, async (req, res, next) => {
//    try {
//        const data = createLocationZ.parse(req.body);
//        const doc = await Location.create(data);
//        res.status(201).json(doc);
//    } catch (e) { next(e); }
//});

//r.put('/:id', requireAdmin, async (req, res, next) => {
//    try {
//        const data = updateLocationZ.parse(req.body);
//        const doc = await Location.findByIdAndUpdate(req.params.id, data, { new: true });
//        if (!doc) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Location not found' } });
//        res.json(doc);
//    } catch (e) { next(e); }
//});

//r.delete('/:id', requireAdmin, async (req, res, next) => {
//    try {
//        const count = await Item.countDocuments({ locationId: req.params.id });
//        if (count > 0) {
//            return res.status(409).json({ error: { code: 'DELETE_CONFLICT', message: 'Location has items' } });
//        }
//        const out = await Location.findByIdAndDelete(req.params.id);
//        if (!out) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Location not found' } });
//        res.status(204).end();
//    } catch (e) { next(e); }
//});

export default r;
