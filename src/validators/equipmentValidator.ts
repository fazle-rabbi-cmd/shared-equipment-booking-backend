import { z } from 'zod';

export const createEquipmentSchema = z.object({
  name: z.string().min(2, 'Equipment name must be at least 2 characters long'),
  description: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
  requiresApproval: z.boolean().optional(),
});

export const updateEquipmentSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  category: z.string().min(2).optional(),
  requiresApproval: z.boolean().optional(),
  isActive: z.boolean().optional(),
});