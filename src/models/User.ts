import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'User must have a name']
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, 'Password is required']
    },
    email: {
      required: [true, ' Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    }
  },
  {
    timestamps: true
  }
);

export default model('User', userSchema);
