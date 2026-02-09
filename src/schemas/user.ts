import { z } from 'zod/v4';
import { dbEntrySchema } from './shared.ts';

const userInputSchema = z.strictObject({
  name: z.string().min(1, 'Name is required').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  email: z.email().trim().toLowerCase()
});

const userUpdateInputSchema = userInputSchema.omit({ password: true, email: true });

const userSchema = z.strictObject({
  ...userInputSchema.shape,
  ...dbEntrySchema.shape
});

export { userInputSchema, userSchema, userUpdateInputSchema };
