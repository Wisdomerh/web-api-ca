import express from 'express';
import Review from './reviewModel';
import asyncHandler from 'express-async-handler';
import authenticate from '../../authenticate';
import { getMovieReviews } from '../tmdb-api';

const router = express.Router();

// Fetch TMDB reviews for a movie
router.get('/tmdb/movie/:id/reviews', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const reviews = await getMovieReviews(id);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Fetch all local reviews for a movie
router.get('/movie/:id', asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.id);
    try {
        const reviews = await Review.find({ movieId }).sort({ created_at: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Fetch all reviews by the authenticated user
router.get('/user', authenticate, asyncHandler(async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.user._id }).sort({ created_at: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Add a new review
router.post('/', authenticate, asyncHandler(async (req, res) => {
    const { movieId, rating, review, movieTitle } = req.body;

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, msg: 'Rating must be between 1 and 5' });
    }
    if (!review || review.trim() === '') {
        return res.status(400).json({ success: false, msg: 'Review content cannot be empty' });
    }

    try {
        const existingReview = await Review.findOne({ userId: req.user._id, movieId });
        if (existingReview) {
            return res.status(400).json({ success: false, msg: 'You have already reviewed this movie' });
        }

        const newReview = new Review({
            userId: req.user._id,
            movieId,
            rating,
            review,
            author: req.user.username,
            movieTitle
        });

        await newReview.save();
        res.status(201).json({ success: true, msg: 'Review added successfully', review: newReview });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Update an existing review
router.put('/:id', authenticate, asyncHandler(async (req, res) => {
    const reviewId = req.params.id;
    const { rating, review } = req.body;

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, msg: 'Rating must be between 1 and 5' });
    }

    try {
        const updatedReview = await Review.findOneAndUpdate(
            { _id: reviewId, userId: req.user._id },
            { rating, review },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ success: false, msg: 'Review not found or unauthorized' });
        }

        res.json({ success: true, msg: 'Review updated successfully', review: updatedReview });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Delete a review
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
    const reviewId = req.params.id;
    try {
        const deletedReview = await Review.findOneAndDelete({ _id: reviewId, userId: req.user._id });
        if (!deletedReview) {
            return res.status(404).json({ success: false, msg: 'Review not found or unauthorized' });
        }

        res.json({ success: true, msg: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

export default router;