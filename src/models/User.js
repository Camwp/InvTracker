import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    avatarUrl: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'admin' },
    passwordHash: { type: String }, // Optional for OAuth
    phoneNumber: { type: String },
    address: { type: String },
    birthDate: { type: Date },
    isDeleted: { type: Boolean, default: false }, // Soft delete flag
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);