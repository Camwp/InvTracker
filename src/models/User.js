import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        email: { type: String, required: true, index: true, unique: true },
        name: { type: String, required: true },
        avatarUrl: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        // Optional for local accounts (not required for Google OAuth):
        passwordHash: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model('User', UserSchema);
