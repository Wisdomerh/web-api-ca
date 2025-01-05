import express from 'express';
import asyncHandler from 'express-async-handler';
import UserMovieData from './userMovieData';
import authenticate from '../../authenticate';

const router = express.Router();

// Get user's favorites
router.get('/favorites', authenticate, asyncHandler(async (req, res) => {
    const userData = await UserMovieData.findOne({ userId: req.user._id });
    if (!userData) {
        return res.json({ favorites: [] });
    }
    res.json({ favorites: userData.favorites });
}));

// Add to favorites
router.post('/favorites', authenticate, asyncHandler(async (req, res) => {
    const movieData = req.body; // Expect the full movie object
    
    let userData = await UserMovieData.findOne({ userId: req.user._id });
    if (!userData) {
        userData = new UserMovieData({ userId: req.user._id, favorites: [] });
    }

    // Check if movie is already in favorites
    if (userData.favorites.some(f => f.id === movieData.id)) {
        return res.status(400).json({ 
            success: false, 
            msg: 'Movie already in favorites' 
        });
    }

    // Add the movie to favorites with addedAt timestamp
    userData.favorites.push({
        ...movieData,
        addedAt: new Date()
    });

    await userData.save();
    
    res.status(201).json({ 
        success: true, 
        msg: 'Movie added to favorites',
        favorites: userData.favorites 
    });
}));

// Remove from favorites
router.delete('/favorites/:movieId', authenticate, asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.movieId);
    
    const userData = await UserMovieData.findOne({ userId: req.user._id });
    if (!userData) {
        return res.status(404).json({ 
            success: false, 
            msg: 'User data not found' 
        });
    }

    userData.favorites = userData.favorites.filter(f => f.id !== movieId);
    await userData.save();
    
    res.json({ 
        success: true, 
        msg: 'Movie removed from favorites',
        favorites: userData.favorites 
    });
}));

export default router;