import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  contentHtml: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
});

// Avoid recompiling the model in development (hot-reload)
export default mongoose.models.Post || mongoose.model('Post', PostSchema);
