// models/Note.js
import mongoose from 'mongoose';
const { Schema, Types } = mongoose;

const NoteSchema = new Schema({
    itemId: { type: Types.ObjectId, ref: 'Item', index: true, required: true },
    authorId: { type: Types.ObjectId, ref: 'User', index: true, required: true },
    body: { type: String, required: true, maxlength: 1000 },
    type: { type: String, enum: ['general', 'damage', 'audit'], default: 'general' },
    pinned: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Note', NoteSchema);
