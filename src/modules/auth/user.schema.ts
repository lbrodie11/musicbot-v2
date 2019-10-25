import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  id: { type: String, required: true },
  email: { type: String, required: true },
});
