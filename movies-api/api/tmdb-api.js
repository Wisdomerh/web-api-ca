import fetch from 'node-fetch';

const tmdbBaseUrl = 'https://api.themoviedb.org/3';

const handleErrors = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'TMDB API error');
    }
    return response.json();
};
export const getMovies = async () => {
    const response = await fetch(
        `${tmdbBaseUrl}/discover/movie?api_key=${process.env.TMDB_KEY}&language=en-US&include_adult=false&include_video=false&page=1`
    );
    return handleErrors(response);
};

export const getMovie = async (id) => {
    const response = await fetch(
        `${tmdbBaseUrl}/movie/${id}?api_key=${process.env.TMDB_KEY}`
    );
    return handleErrors(response);
};

export const getGenres = async () => {
    const response = await fetch(
        `${tmdbBaseUrl}/genre/movie/list?api_key=${process.env.TMDB_KEY}&language=en-US`
    );
    return handleErrors(response);
};

export const getMovieImages = async (id) => {
    const response = await fetch(
        `${tmdbBaseUrl}/movie/${id}/images?api_key=${process.env.TMDB_KEY}`
    );
    return handleErrors(response);
};

