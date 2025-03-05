import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  secretKey: { type: String, required: true, unique: true }, // This will be our simple auth token
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema); 