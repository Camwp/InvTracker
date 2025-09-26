import { z } from 'zod';

export const createLocationZ = z.object({
    name: z.string().min(1).max(60),
    code: z.string().min(1).max(20),
    address: z.string().max(300).optional(),
    notes: z.string().max(1000).optional(),
});

export const updateLocationZ = createLocationZ.partial();
