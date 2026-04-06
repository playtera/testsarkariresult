import mongoose from 'mongoose';

const SiteCacheSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    lastScrapedAt: { type: Date, default: Date.now }
});

export default mongoose.models.SiteCache || mongoose.model('SiteCache', SiteCacheSchema);
