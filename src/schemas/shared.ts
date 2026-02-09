import { Types } from 'mongoose';
import { z } from 'zod/v4';

const dbEntrySchema = z.strictObject({
  _id: z.instanceof(Types.ObjectId),
  createdAt: z.date(),
  updatedAt: z.date(),
  __v: z.int().nonnegative()
});
export { dbEntrySchema };
