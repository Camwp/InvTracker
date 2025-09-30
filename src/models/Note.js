import mongoose from 'mongoose';
const { Schema, Types } = mongoose;

// Define the schema for the Note collection
const NoteSchema = new Schema({
    // Reference to the associated Item document, required and indexed for performance
    itemId: { type: Types.ObjectId, ref: 'Item', index: true, required: true },
    // Reference to the User who created the note, required and indexed
    authorId: { type: Types.ObjectId, ref: 'User', index: true, required: true },
    // Note content, required with a maximum length of 1000 characters
    body: { type: String, required: true, maxlength: 1000 },
    // Type of note, limited to specific values, defaults to 'general'
    type: { type: String, enum: ['general', 'damage', 'audit'], default: 'general' },
    // Indicates if the note is pinned, defaults to false
    pinned: { type: Boolean, default: false },
}, {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true
});

// Create and export the Note model for use in database operations
export default mongoose.model('Note', NoteSchema);