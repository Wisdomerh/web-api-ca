import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  author: { type: String, required: true },
  movieTitle: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

ReviewSchema.index({ userId: 1, movieId: 1 });
ReviewSchema.index({ movieId: 1 });

export default mongoose.model('Review', ReviewSchema);