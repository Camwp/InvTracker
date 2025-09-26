import mongoose from 'mongoose';
const { Schema } = mongoose;

const LocationSchema = new Schema(
    {
        name: { type: String, required: true, maxlength: 60, index: true },
        code: { type: String, required: true, maxlength: 20, index: true },
        address: { type: String },
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model('Location', LocationSchema);
