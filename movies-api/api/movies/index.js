import movieModel from './movieModel';
import asyncHandler from 'express-async-handler';
import express from 'express';
import {
    getMovies, getMovie, getGenres, getMovieImages, getMovieReviews,
    getUpcomingMovies, getNowPlayingMovies, getTopRatedMovies,
    getPopularMovies, getTrendingMovies, getMovieRecommendations,
    getMovieCredits, getPersonDetails, getPersonMovieCredits
} from '../tmdb-api';
  
const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    let { page = 1, limit = 10 } = req.query; // destructure page and limit and set default values
    [page, limit] = [+page, +limit]; //trick to convert to numeric (req.query will contain string values)

    // Parallel execution of counting movies and getting movies using movieModel
    const [total_results, results] = await Promise.all([
        movieModel.estimatedDocumentCount(),
        movieModel.find().limit(limit).skip((page - 1) * limit)
    ]);
    const total_pages = Math.ceil(total_results / limit); //Calculate total number of pages (= total No Docs/Number of docs per page) 

    //construct return Object and insert into response object
    const returnObject = {
        page,
        total_pages,
        total_results,
        results
    };
    res.status(200).json(returnObject);
}));


// Get discover movies
router.get('/tmdb/discover', asyncHandler(async (req, res) => {
    const movies = await getMovies();
    res.status(200).json(movies);
}));

// Get movie details
router.get('/tmdb/movie/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const movie = await getMovie(id);
    res.status(200).json(movie);
}));

// Get genres
router.get('/tmdb/genres', asyncHandler(async (req, res) => {
    const genres = await getGenres();
    res.status(200).json(genres);
}));

// Get movie images
router.get('/tmdb/movie/:id/images', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const images = await getMovieImages(id);
    res.status(200).json(images);
}));

// Get upcoming movies
router.get('/tmdb/upcoming', asyncHandler(async (req, res) => {
    const movies = await getUpcomingMovies();
    res.status(200).json(movies);
}));

// Get now playing movies
router.get('/tmdb/now-playing', asyncHandler(async (req, res) => {
    const movies = await getNowPlayingMovies();
    res.status(200).json(movies);
}));

// Get top rated movies
router.get('/tmdb/top-rated', asyncHandler(async (req, res) => {
    const movies = await getTopRatedMovies();
    res.status(200).json(movies);
}));

// Get popular movies
router.get('/tmdb/popular', asyncHandler(async (req, res) => {
    const movies = await getPopularMovies();
    res.status(200).json(movies);
}));

// Get trending movies
router.get('/tmdb/trending', asyncHandler(async (req, res) => {
    const movies = await getTrendingMovies();
    res.status(200).json(movies);
}));

// Get movie recommendations
router.get('/tmdb/movie/:id/recommendations', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const recommendations = await getMovieRecommendations(id);
    res.status(200).json(recommendations);
}));

// Get movie credits
router.get('/tmdb/movie/:id/credits', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const credits = await getMovieCredits(id);
    res.status(200).json(credits);
}));

// Get person details
router.get('/tmdb/person/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const person = await getPersonDetails(id);
    res.status(200).json(person);
}));

// Get person movie credits
router.get('/tmdb/person/:id/movie-credits', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const credits = await getPersonMovieCredits(id);
    res.status(200).json(credits);
}));

export default router;