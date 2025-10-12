import { z } from 'zod';

export const createCategoryValidator = z.object({
    name: z.string().min(1).max(80),
    description: z.string().max(600).optional(),
    color: z.string().regex(/^#([0-9A-Fa-f]{6})$/).optional(),
});

export const updateCategoryValidator = createCategoryValidator.partial();
