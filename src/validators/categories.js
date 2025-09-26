import { z } from 'zod';

export const createCategoryZ = z.object({
    name: z.string().min(1).max(60),
    description: z.string().max(500).optional(),
    color: z.string().regex(/^#([0-9A-Fa-f]{6})$/).optional(),
});

export const updateCategoryZ = createCategoryZ.partial();
