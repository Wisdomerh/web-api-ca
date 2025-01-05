import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserMovieDataSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  favorites: [{
    adult: { type: Boolean },
    id: { type: Number, required: true },
    poster_path: { type: String },
    overview: { type: String },
    release_date: { type: String },
    original_title: { type: String },
    genre_ids: [{ type: Number }],
    original_language: { type: String },
    title: { type: String },
    backdrop_path: { type: String },
    popularity: { type: Number },
    vote_count: { type: Number },
    video: { type: Boolean },
    vote_average: { type: Number },
    addedAt: { type: Date, default: Date.now }
  }]
});

// Add indexes for better query performance
UserMovieDataSchema.index({ userId: 1 });
UserMovieDataSchema.index({ 'favorites.id': 1 });

export default mongoose.model('UserMovieData', UserMovieDataSchema);