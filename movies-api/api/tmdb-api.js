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

export const getUpcomingMovies = async () => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
        );

        if (!response.ok) {
            throw new Error(response.json().message);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getGenres = async () => {
    try {
        const response = await fetch(
             `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_KEY}&language=en-US`
        );

        if (!response.ok) {
            throw new Error(response.json().message);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};
