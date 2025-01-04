const BASE_URL = 'http://localhost:8080/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) return {};
  
  return {
      'Authorization': token,
      'Content-Type': 'application/json'
  };
};
export const signup = async (username, password) => {
  console.log('Attempting to register user:', username);
  try {
      const response = await fetch(
          `${BASE_URL}/users?action=register`,
          {
              headers: {
                  'Content-Type': 'application/json'
              },
              method: 'POST',
              body: JSON.stringify({ username, password })
          }
      );

      const data = await response.json();
      console.log('Registration response:', data);

      if (!response.ok) {
          throw new Error(data.msg || 'Registration failed');
      }

      return data;
  } catch (error) {
      console.error('Registration error:', error);
      throw error;
  }
};

export const login = async (username, password) => {
  try {
      const response = await fetch(
          `${BASE_URL}/users`,
          {
              headers: {
                  'Content-Type': 'application/json'
              },
              method: 'POST',
              body: JSON.stringify({ username, password })
          }
      );

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.msg || 'Login failed');
      }

      // Store the token
      localStorage.setItem('token', data.token);
      
      return data;
  } catch (error) {
      throw error;
  }
};

// Movies
export const getMovies = () => {
    return fetch(`${BASE_URL}/movies/tmdb/discover`, {
        headers: getAuthHeaders(),
    }).then(handleResponse);
};

export const getMovie = (args) => {
    const [, idPart] = args.queryKey;
    const { id } = idPart;
    return fetch(`${BASE_URL}/movies/tmdb/movie/${id}`, {
        headers: getAuthHeaders(),
    }).then(handleResponse);
};

export const getGenres = () => {
    return fetch(`${BASE_URL}/movies/tmdb/genres`, {
        headers: getAuthHeaders(),
    }).then(handleResponse);
};

export const getMovieImages = ({ queryKey }) => {
    const [, idPart] = queryKey;
    const { id } = idPart;
    return fetch(`${BASE_URL}/movies/tmdb/movie/${id}/images`, {
        headers: getAuthHeaders(),
    }).then(handleResponse);
};

export const getUpcomingMovies = () => {
    return fetch(`${BASE_URL}/movies/tmdb/upcoming`, {
        headers: getAuthHeaders(),
    }).then(handleResponse);
};

export const getNowPlayingMovies = () => {
    return fetch(`${BASE_URL}/movies/tmdb/now-playing`, {
        headers: getAuthHeaders(),
    }).then(handleResponse);
};

export const getTopRatedMovies = () => {
    return fetch(`${BASE_URL}/movies/tmdb/top-rated`, {
        headers: getAuthHeaders(),
    }).then(handleResponse);
};

export const getPopularMovies = () => {
    return fetch(`${BASE_URL}/movies/tmdb/popular`, {
        headers: getAuthHeaders(),
    }).then(handleResponse);
};

export const getTrendingMovies = () => {
    return fetch(`${BASE_URL}/movies/tmdb/trending`, {
        headers: getAuthHeaders(),
    }).then(handleResponse);
};

export const getMovieRecommendations = (id) => {
    return fetch(`${BASE_URL}/movies/tmdb/movie/${id}/recommendations`, {
        headers: getAuthHeaders(),
    }).then(handleResponse);
};

export const getMovieCredits = (id) => {
    return fetch(`${BASE_URL}/movies/tmdb/movie/${id}/credits`, {
        headers: getAuthHeaders(),
    }).then(handleResponse);
};

export const getPersonDetails = (id) => {
    return fetch(`${BASE_URL}/movies/tmdb/person/${id}`, {
        headers: getAuthHeaders(),
    }).then(handleResponse);
};

export const getPersonMovieCredits = (id) => {
    return fetch(`${BASE_URL}/movies/tmdb/person/${id}/movie-credits`, {
        headers: getAuthHeaders(),
    }).then(handleResponse);
};


export const getMovieReviews = ({ queryKey }) => {
    const [, idPart] = queryKey;
    const { id } = idPart;
    return fetch(`${BASE_URL}/reviews/movie/${id}`, {  // Changed to match your backend route
        headers: getAuthHeaders(),
    }).then(handleResponse);
};

// Add function for getting TMDB reviews specifically
export const getTMDBMovieReviews = ({ queryKey }) => {
    const [, idPart] = queryKey;
    const { id } = idPart;
    return fetch(`${BASE_URL}/reviews/tmdb/movie/${id}/reviews`, {  // This matches your TMDB route
        headers: getAuthHeaders(),
    }).then(handleResponse);
};

export const addReview = async (movieId, review, rating, movieTitle) => {
    return fetch(`${BASE_URL}/reviews`, {  // Removed extra 'api' from path
        method: 'POST',
        headers: {
            ...getAuthHeaders(),
        },
        body: JSON.stringify({
            movieId,
            review,
            rating,
            movieTitle
        })
    }).then(handleResponse);
};

export const deleteReview = async (reviewId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
        return response.json();
    } catch (error) {
        throw error;
    }
};

export const updateReview = async (reviewId, review, rating) => {
    try {
        const response = await fetch(`${BASE_URL}/api/reviews/${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                review,
                rating
            })
        });
        return response.json();
    } catch (error) {
        throw error;
    }
};