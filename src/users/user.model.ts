import { Document, model, Schema } from 'mongoose';
import User from './user.interface';

const addressSchema = new Schema({
  city: String,
  street: String,
});

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  address: addressSchema,
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
