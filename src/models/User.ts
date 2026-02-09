import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'User must have a name'],
      trim: true
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, 'Password is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email is not valid']
    }
  },
  {
    timestamps: true
  }
);

export default model('User', userSchema);
