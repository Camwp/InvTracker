import { z } from 'zod';

export const createNoteZ = z.object({
    body: z.string().min(1).max(1000),
    type: z.enum(['general', 'damage', 'audit']).optional(),
    pinned: z.boolean().optional(),
});

// For PUT you probably want partial:
export const updateNoteZ = createNoteZ.partial();
