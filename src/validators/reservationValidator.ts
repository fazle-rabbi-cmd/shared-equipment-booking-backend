import { z } from 'zod';

export const createReservationSchema = z.object({
  equipmentId: z.number().int().positive('Equipment ID must be a positive integer'),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start time date format',
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid end time date format',
  }),
}).refine((data) => new Date(data.startTime) < new Date(data.endTime), {
  message: 'Start time must be strictly before end time',
  path: ['startTime'],
});