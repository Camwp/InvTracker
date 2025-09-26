import mongoose from 'mongoose';
const { Schema } = mongoose;

const CategorySchema = new Schema(
    {
        name: { type: String, required: true, maxlength: 60, index: true },
        description: { type: String },
        color: { type: String }, // e.g. #RRGGBB
    },
    { timestamps: true }
);

export default mongoose.model('Category', CategorySchema);
