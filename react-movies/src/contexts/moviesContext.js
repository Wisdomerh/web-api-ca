import React, { useState, useEffect } from "react";
import { useAuth } from "./authContext";
import { getDatabase, ref, set, get } from "firebase/database";

export const MoviesContext = React.createContext(null);

const MoviesContextProvider = (props) => {
  const [favorites, setFavorites] = useState([]); // Manages the list of user's favorite movies
  const [myReviews, setMyReviews] = useState({}); // Stores user's reviews for movies
  const [mustWatch, setMustWatch] = useState([]); // Tracks the list of movies marked as must-watch
  const { currentUser } = useAuth(); // Retrieves the currently logged-in user
  const db = getDatabase(); // Initializes the Firebase Realtime Database instance

  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        console.log("Loading data for user:", currentUser.uid);

        try {
          // Load user's favorite movies
          const favRef = ref(db, `users/${currentUser.uid}/favorites`);
          const favSnapshot = await get(favRef);
          if (favSnapshot.exists()) {
            setFavorites(favSnapshot.val());
            console.log("Loaded favorites:", favSnapshot.val());
          }

          // Load user's must-watch list
          const watchRef = ref(db, `users/${currentUser.uid}/mustWatch`);
          const watchSnapshot = await get(watchRef);
          if (watchSnapshot.exists()) {
            setMustWatch(watchSnapshot.val());
            console.log("Loaded must-watch:", watchSnapshot.val());
          }

          // Load user's movie reviews
          const reviewsRef = ref(db, `users/${currentUser.uid}/reviews`);
          const reviewsSnapshot = await get(reviewsRef);
          if (reviewsSnapshot.exists()) {
            setMyReviews(reviewsSnapshot.val());
            console.log("Loaded reviews:", reviewsSnapshot.val());
          }
        } catch (error) {
          console.error("Error loading user data:", error); // Handle errors while fetching data
        }
      } else {
        // Reset data if no user is logged in
        setFavorites([]);
        setMustWatch([]);
        setMyReviews({});
      }
    };

    loadUserData(); // Load user data when currentUser changes
  }, [currentUser, db]);

  const addToFavorites = async (movie) => {
    if (!currentUser) return;

    try {
      let newFavorites = [...favorites];
      if (!favorites.includes(movie.id)) {
        newFavorites.push(movie.id);

        // Update user's favorites in the database
        const favRef = ref(db, `users/${currentUser.uid}/favorites`);
        await set(favRef, newFavorites);

        setFavorites(newFavorites); // Update the state with new favorites
        console.log("Movie added to favorites");
      }
    } catch (error) {
      console.error("Error adding favorite:", error); // Handle errors during the update
    }
  };

  const removeFromFavorites = async (movie) => {
    if (!currentUser) return;

    try {
      const newFavorites = favorites.filter((mId) => mId !== movie.id);

      // Remove movie from favorites in the database
      const favRef = ref(db, `users/${currentUser.uid}/favorites`);
      await set(favRef, newFavorites);

      setFavorites(newFavorites); // Update the state after removing the movie
      console.log("Movie removed from favorites");
    } catch (error) {
      console.error("Error removing favorite:", error); // Handle errors during removal
    }
  };

  const addToMustWatch = async (movie) => {
    if (!currentUser) return;

    try {
      let newMustWatch = [...mustWatch];
      if (!mustWatch.includes(movie.id)) {
        newMustWatch.push(movie.id);

        // Update user's must-watch list in the database
        const watchRef = ref(db, `users/${currentUser.uid}/mustWatch`);
        await set(watchRef, newMustWatch);

        setMustWatch(newMustWatch); // Update the state with the new must-watch list
        console.log("Movie added to must-watch");
      }
    } catch (error) {
      console.error("Error adding to must-watch:", error); // Handle errors during the update
    }
  };

  const removeFromMustWatch = async (movieId) => {
    if (currentUser) {
      const updatedList = mustWatch.filter((id) => id !== movieId);
      const mustWatchRef = ref(db, `users/${currentUser.uid}/mustWatch`);
      await set(mustWatchRef, updatedList);
      setMustWatch(updatedList);
    }
  };

  const addReview = async (movie, review) => {
    if (!currentUser) return;

    try {
      const updatedReviews = {
        ...myReviews,
        [movie.id]: review,
      };

      // Save user's review in the database
      const reviewRef = ref(db, `users/${currentUser.uid}/reviews/${movie.id}`);
      await set(reviewRef, review);

      setMyReviews(updatedReviews); // Update the state with the new review
      console.log("Review added");
    } catch (error) {
      console.error("Error adding review:", error); // Handle errors during the update
    }
  };

  return (
    <MoviesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        mustWatch,
        addToMustWatch,
        removeFromMustWatch,
        addReview,
        myReviews,
      }}
    >
      {props.children} {/* Passes context data to child components */}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;
