// Import Zod for schema validation
import { z } from 'zod';

// Define schema for creating a new location
export const createLocationZ = z.object({
    // Required location name, 1-60 characters
    name: z.string().min(1).max(60),

    // Required location code, 1-20 characters
    code: z.string().min(1).max(20),

    // Optional address, max 300 characters
    address: z.string().max(300).optional(),

    // Optional notes, max 1000 characters
    notes: z.string().max(1000).optional(),
});

// Define schema for updating a location, making all fields optional
export const updateLocationZ = createLocationZ.partial();