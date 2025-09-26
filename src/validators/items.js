import { z } from 'zod';

export const createItemZ = z.object({
    name: z.string().min(1).max(120),
    sku: z.string().min(1).max(60),
    categoryId: z.string().min(1),
    locationId: z.string().min(1),
    qtyOnHand: z.number().int().min(0),
    unit: z.string().min(1).max(10),
    unitCost: z.number().min(0),
    reorderLevel: z.number().int().min(0),
    status: z.enum(['active', 'archived']).optional(),
    barcode: z.string().max(120).optional(),
    tags: z.array(z.string().min(1).max(20)).max(10).optional(),
});

export const updateItemZ = createItemZ.partial();
