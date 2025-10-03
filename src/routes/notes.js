import express from 'express';
import Note from '../models/Note.js';
import Item from '../models/Item.js';
import mongoose from 'mongoose';

import { createNoteZ, updateNoteZ } from '../validators/notes.js';
import { requireAuth } from '../middleware/auth.js';

// Create an Express router for note-related endpoints
const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Get all notes, with optional filtering by type and pinned status
router.get('/notes', async (req, res, next) => {
    try {
        const { type, pinned } = req.query;
        const filter = {};
        // Filter by note type if provided
        if (type) filter.type = type;
        // Filter by pinned status if provided
        if (pinned !== undefined) filter.pinned = pinned === 'true';
        // Fetch notes, sorted by creation date (newest first)
        const notes = await Note.find(filter).sort({ createdAt: -1 }).lean();

        // Return notes as JSON
        res.json(notes);
    } catch (e) {
        // Pass errors to global error handler
        next(e);
    }
});
// GET notes for a specific item
router.get('/notes/:itemId', async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { type, pinned } = req.query;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid item ID' } });
        }

        // (Optional) 404 if the item doesn't exist. Remove this block if you prefer returning [].
        const itemExists = await Item.exists({ _id: itemId });
        if (!itemExists) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
        }

        const filter = { itemId };
        if (type) filter.type = type;
        if (pinned !== undefined) filter.pinned = pinned === 'true';

        const notes = await Note.find(filter).sort({ createdAt: -1 }).lean();
        res.json(notes);
    } catch (e) {
        next(e);
    }
});

// Get a single note by its ID
router.get('/notes/single/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid note ID' } });
        }

        // Fetch note by ID, return plain object
        const note = await Note.findById(id).lean();
        if (!note) {
            // Return 404 if note doesn't exist
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Note not found' } });
        }

        // Return note as JSON
        res.json(note);
    } catch (e) {
        // Pass errors to global error handler
        next(e);
    }
});
router.post('/notes/:itemId', async (req, res, next) => {
    try {
        const { itemId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid item ID' } });
        }

        const data = createNoteZ.parse(req.body);          // { body, type?, pinned? }
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Item not found' } });
        }

        const note = await Note.create({
            itemId,                     // from path
            authorId: req.user._id,     // from session
            ...data,
        });

        res.status(201).json(note);
    } catch (e) { next(e); }
});


// Update an existing note
router.put('/notes/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid note ID' } });
        }

        // Validate request body with Zod schema
        const data = updateNoteZ.parse(req.body);
        // Fetch note by ID
        const note = await Note.findById(id);

        if (!note) {
            // Return 404 if note doesn't exist
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Note not found' } });
        }
        // Check if user is note author or admin
        const isOwner = String(note.authorId) === String(req.user._id);
        // Check if user is admin
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Not allowed' } }); // Return 403 if unauthorized
        }

        // Update note fields
        Object.assign(note, data);
        // Save updated note
        await note.save();

        // Return updated note as JSON
        res.json(note);
    } catch (e) {
        // Pass errors to global error handler
        next(e);
    }
});

// Delete a note
router.delete('/notes/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid note ID' } });
        }

        // Fetch note by ID
        const note = await Note.findById(id);

        if (!note) {
            // Return 404 if note doesn't exist
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Note not found' } });
        }
        // Check if user is note author or admin
        const isOwner = String(note.authorId) === String(req.user._id);
        // Check if user is admin
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            // Return 403 if unauthorized
            return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Not allowed' } });
        }

        // Delete note from database
        await note.deleteOne();

        // Return 204 (no content) on success
        res.status(204).end();
    } catch (e) {
        // Pass errors to global error handler
        next(e);
    }
});

// Export the router for use in the main app
export default router;