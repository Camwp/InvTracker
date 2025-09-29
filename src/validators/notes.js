import { z } from 'zod';
import mongoose from 'mongoose';

// Schema for creating a new note
export const createNoteZ = z.object({
    // Required item ID, must be a valid MongoDB ObjectId
    itemId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid item ID',
    }),
    // Required note content, 1-1000 characters
    body: z.string().min(1).max(1000),
    // Optional note type, must be one of 'general', 'damage', or 'audit'
    type: z.enum(['general', 'damage', 'audit']).optional(),
    // Optional boolean to indicate if note is pinned
    pinned: z.boolean().optional(),
});

// Schema for updating a note, all fields optional
export const updateNoteZ = createNoteZ.partial({
    itemId: true,
    body: true,
    type: true,
    pinned: true,
});