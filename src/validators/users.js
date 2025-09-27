import { z } from 'zod';

export const createUserZ = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  avatarUrl: z.string().url().optional(),
  role: z.enum(['user', 'admin']).optional(),
  passwordHash: z.string().min(6).optional(), // Optional for OAuth
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  birthDate: z.coerce.date().optional(), // Accepts string or Date
});

export const updateUserZ = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
  role: z.enum(['user', 'admin']).optional(),
  passwordHash: z.string().min(6).optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  birthDate: z.coerce.date().optional(),
});