// validators/notes.js
import { z } from 'zod';

export const createNoteZ = z.object({
    body: z.string().min(1).max(1000),
    type: z.enum(['general', 'damage', 'audit']).optional(),
    pinned: z.boolean().optional(),
});

export const updateNoteZ = z.object({
    body: z.string().min(1).max(1000).optional(),
    type: z.enum(['general', 'damage', 'audit']).optional(),
    pinned: z.boolean().optional(),
});
