// Import Mongoose for MongoDB schema and model creation
import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the schema for the Location collection in MongoDB
const LocationSchema = new Schema(
    {
        // Location name, required, max 60 characters, indexed for query performance
        name: { type: String, required: true, maxlength: 60, index: true },

        // Unique location code, required, max 20 characters, indexed for performance
        code: { type: String, required: true, maxlength: 20, index: true },

        // Optional address field, no length restriction
        address: { type: String },

        // Optional notes field, no length restriction
        notes: { type: String },
    },
    {
        // Enable automatic createdAt and updatedAt timestamps
        timestamps: true
    }
);

// Create and export the Location model for database operations
export default mongoose.model('Location', LocationSchema);