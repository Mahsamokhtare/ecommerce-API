import { Schema } from 'mongoose';
import User from './User';
import Product from './Product';

const orderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});
const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    products: {
      type: [orderItemSchema],
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);
