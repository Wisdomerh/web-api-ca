import React, { useState, useEffect, createContext } from "react";
import { useAuth } from "./authContext";

export const MoviesContext = createContext(null);

const MoviesContextProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const { isAuthenticated } = useAuth();
    const BASE_URL = 'http://localhost:8080/api';

    useEffect(() => {
        if (isAuthenticated) {
            fetchFavorites();
        } else {
            setFavorites([]);
        }
    }, [isAuthenticated]);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/users/favorites`, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            setFavorites(data.favorites || []);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setFavorites([]);
        }
    };

    const addToFavorites = async (movie) => {
        try {
            const token = localStorage.getItem('token');
            const movieData = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                overview: movie.overview,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
                genre_ids: movie.genre_ids || [], // Add genre_ids
                genres: movie.genres || [],       // Add genres if available
                runtime: movie.runtime,
                vote_count: movie.vote_count,
                popularity: movie.popularity
            };

            const response = await fetch(`${BASE_URL}/users/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(movieData)
            });

            const data = await response.json();
            if (data.success) {
                await fetchFavorites();
            } else {
                console.error('Failed to add favorite:', data.msg);
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    const removeFromFavorites = async (movie) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/users/favorites/${movie.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token
                }
            });

            const data = await response.json();
            if (data.success) {
                await fetchFavorites();
            } else {
                console.error('Failed to remove favorite:', data.msg);
            }
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    };

    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId);
    };

    return (
        <MoviesContext.Provider
            value={{
                favorites,
                addToFavorites,
                removeFromFavorites,
                isFavorite
            }}
        >
            {children}
        </MoviesContext.Provider>
    );
};

export default MoviesContextProvider;