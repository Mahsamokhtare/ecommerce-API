import { z } from 'zod/v4';

const categoryInputSchema = z.strictObject({
  name: z.string().min(1).trim()
});

export { categoryInputSchema };
