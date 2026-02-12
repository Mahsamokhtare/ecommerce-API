import { z } from 'zod/v4';
import { dbEntrySchema } from './shared.ts';

const categoryInputSchema = z.strictObject({
  name: z.string().min(1).trim()
});

const categorySchema = z.strictObject({
  ...categoryInputSchema.shape,
  ...dbEntrySchema.shape
});

export { categoryInputSchema, categorySchema };
