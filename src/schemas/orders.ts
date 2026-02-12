import { isValidObjectId, Types } from 'mongoose';
import { z } from 'zod/v4';
import { dbEntrySchema } from './shared.ts';
import { productInputSchema } from './product.ts';
import { userInputSchema } from './user.ts';

const orderItemZodSchema = z.strictObject({
  productId: z.string().refine(val => isValidObjectId(val), 'Invalid product ID'),
  quantity: z.number().min(1)
});

const orderInputSchema = z.strictObject({
  userId: z.string().refine(val => isValidObjectId(val), 'Invalid user ID'),
  // total: z.number(),
  products: z.array(orderItemZodSchema).min(1)
});

const populatedProductSchema = z.strictObject({
  ...productInputSchema.pick({ name: true, price: true }).shape,
  _id: z.instanceof(Types.ObjectId)
});

const populatedUserSchema = z.strictObject({
  ...userInputSchema.pick({ name: true, email: true }).shape,
  _id: z.instanceof(Types.ObjectId)
});

const orderSchema = z.strictObject({
  userId: populatedUserSchema,
  products: z
    .array(
      z.strictObject({
        productId: populatedProductSchema, // full product object
        quantity: z.number().min(1)
      })
    )
    .min(1),
  ...dbEntrySchema
});

export { orderSchema, orderInputSchema, populatedProductSchema, populatedUserSchema };
