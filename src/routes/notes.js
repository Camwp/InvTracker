// routes/notes.js
import express from 'express';
import Note from '../models/Note.js';
import Item from '../models/Item.js';
import { createNoteZ, updateNoteZ } from '../validators/notes.js';
import { requireAuth } from '../middleware/auth.js';

const r = express.Router();
r.use(requireAuth);

//r.get('/items/:itemId/notes', async (req, res, next) => {
//    try {
//        const { type, pinned } = req.query;
//        const filter = { itemId: req.params.itemId };
//        if (type) filter.type = type;
//        if (pinned !== undefined) filter.pinned = pinned === 'true';
//        const notes = await Note.find(filter).sort({ createdAt: -1 });
//        res.json(notes);
//    } catch (e) { next(e); }
//});

//r.post('/items/:itemId/notes', async (req, res, next) => {
//    try {
//        const item = await Item.findById(req.params.itemId);
//        if (!item) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
//        const data = createNoteZ.parse(req.body);
//        const note = await Note.create({ ...data, itemId: item._id, authorId: req.user._id });
//        res.status(201).json(note);
//    } catch (e) { next(e); }
//});

//r.put('/notes/:id', async (req, res, next) => {
//    try {
//        const data = updateNoteZ.parse(req.body);
//        const note = await Note.findById(req.params.id);
//        if (!note) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Note not found' } });
//        const isOwner = String(note.authorId) === String(req.user._id);
//        const isAdmin = req.user.role === 'admin';
//        if (!isOwner && !isAdmin) return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Not allowed' } });
//        Object.assign(note, data);
//        await note.save();
//        res.json(note);
//    } catch (e) { next(e); }
//});

//r.delete('/notes/:id', async (req, res, next) => {
//    try {
//        const note = await Note.findById(req.params.id);
//        if (!note) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Note not found' } });
//        const isOwner = String(note.authorId) === String(req.user._id);
//        const isAdmin = req.user.role === 'admin';
//        if (!isOwner && !isAdmin) return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Not allowed' } });
//        await note.deleteOne();
//        res.status(204).end();
//    } catch (e) { next(e); }
//});

export default r;
