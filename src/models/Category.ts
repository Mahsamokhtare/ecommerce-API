import { model, Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);
export default model('Category', categorySchema);
