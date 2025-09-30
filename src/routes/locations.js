// Import dependencies for routing, models, validation, and authentication
import express from 'express';
import mongoose from 'mongoose';           // ⬅️ add this
import Location from '../models/Location.js';
import Item from '../models/Item.js';
import { createLocationZ, updateLocationZ } from '../validators/locations.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

// Initialize Express router for location-related endpoints
const r = express.Router();

// Apply authentication middleware to all routes
r.use(requireAuth);

// Fetch all locations, sorted alphabetically by name
r.get('/', async (_req, res, next) => {
    // Query all locations, return plain objects for performance
    try {
        const locs = await Location.find().sort({ name: 1 }).lean();
        // Return locations as JSON
        res.json(locs);
        // Pass errors to global error handler
    } catch (e) {
        next(e);
    }
});

// Fetch a single location by its ID
r.get('/:id', async (req, res, next) => {
    // Extract ID from request parameters
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid location ID' } });
        }

        // Query location by ID, return plain object for performance
        const doc = await Location.findById(id).lean();
        // Return 404 if location doesn't exist
        if (!doc) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Location not found' } });
        }
        // Return location as JSON
        res.json(doc);
        // Pass errors to global error handler
    } catch (e) {
        next(e);
    }
});

// Create a new location, restricted to admin users
r.post('/', requireAdmin, async (req, res, next) => {
    // Validate request body with Zod schema
    try {
        const data = createLocationZ.parse(req.body);
        // Create location in database
        const doc = await Location.create(data);
        // Return created location with 201 status
        res.status(201).json(doc);
        // Pass errors to global error handler
    } catch (e) {
        next(e);
    }
});

// Update an existing location, restricted to admin users
r.put('/:id', requireAdmin, async (req, res, next) => {
    // Extract ID from request parameters
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid location ID' } });
        }

        // Validate request body with Zod schema
        const data = updateLocationZ.parse(req.body);
        // Update location, return updated document
        const doc = await Location.findByIdAndUpdate(id, data, { new: true });
        // Return 404 if location doesn't exist
        if (!doc) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Location not found' } });
        }
        // Return updated location
        res.json(doc);
        // Pass errors to global error handler
    } catch (e) {
        next(e);
    }
});

// Delete a location, restricted to admin users
r.delete('/:id', requireAdmin, async (req, res, next) => {
    // Extract ID from request parameters
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid location ID' } });
        }

        // Check for items associated with location
        const count = await Item.countDocuments({ locationId: id });
        // Return 409 if location is in use
        if (count > 0) {
            return res.status(409).json({ error: { code: 'DELETE_CONFLICT', message: 'Location has items' } });
        }
        // Delete location by ID
        const out = await Location.findByIdAndDelete(id);
        // Return 404 if location doesn't exist
        if (!out) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Location not found' } });
        }
        // Return 204 (no content) on success
        res.status(204).end();
        // Pass errors to global error handler
    } catch (e) {
        next(e);
    }
});

// Export the router for integration into the main app
export default r;