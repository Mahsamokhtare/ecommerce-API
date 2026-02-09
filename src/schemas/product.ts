import { isValidObjectId, Types } from 'mongoose';
import { z } from 'zod/v4';
import { categoryInputSchema } from './category';
import { dbEntrySchema } from './shared';

const productInputSchema = z.strictObject({
  name: z.string().min(1).trim(),
  description: z.string().min(1).trim(),
  price: z.number().min(0),
  categoryId: z.string().refine(val => isValidObjectId(val), 'Invalid category ID')
});

const populatedCategorySchema = z.strictObject({
  ...categoryInputSchema.pick({ name: true }).shape,
  _id: z.instanceof(Types.ObjectId)
});

const productSchema = z.strictObject({
  ...productInputSchema.shape,
  ...dbEntrySchema.shape,
  categoryId: populatedCategorySchema
});

export { productSchema, populatedCategorySchema, productInputSchema };
