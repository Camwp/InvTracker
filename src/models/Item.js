import mongoose from 'mongoose';
const { Schema, Types } = mongoose;

const ItemSchema = new Schema(
    {
        name: { type: String, required: true, maxlength: 120, index: true },
        sku: { type: String, required: true, maxlength: 60, index: true, unique: false }, // set true if you want unique SKU
        categoryId: { type: Types.ObjectId, ref: 'Category', required: true, index: true },
        locationId: { type: Types.ObjectId, ref: 'Location', required: true, index: true },
        qtyOnHand: { type: Number, required: true, min: 0, default: 0 },
        unit: { type: String, required: true, maxlength: 10, default: 'box' }, // 'ea','box','kg',...
        unitCost: { type: Number, required: true, min: 0, default: 0 },
        reorderLevel: { type: Number, required: true, min: 0, default: 0 },
        status: { type: String, enum: ['active', 'archived'], default: 'active' },
        barcode: { type: String },
        tags: [{ type: String, maxlength: 20 }],
    },
    { timestamps: true }
);

export default mongoose.model('Item', ItemSchema);
