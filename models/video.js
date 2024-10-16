import mongoose, { Schema } from 'mongoose';

// Video modelis
export default mongoose.model('Video', new Schema({
    title: String,
    description: String,
    videoId: String,
    thumbnail: String,
    views: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}));
