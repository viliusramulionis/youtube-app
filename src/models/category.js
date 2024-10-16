import mongoose, { Schema } from 'mongoose';

// Categories modelis
export default mongoose.model('Category', new Schema({
    name: String,
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}));
