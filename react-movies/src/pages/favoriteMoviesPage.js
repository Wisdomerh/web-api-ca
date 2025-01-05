import React, { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import Spinner from '../components/spinner';
import RemoveFromFavorites from "../components/cardIcons/removeFromFavorites";
import WriteReview from "../components/cardIcons/addReview";

const FavoriteMoviesPage = () => {
  const { favorites } = useContext(MoviesContext);

  // Add loading state if needed
  if (!favorites) {
    return <Spinner />;
  }

  // Format movie data to include genre_ids if not present
  const movies = favorites.map(movie => ({
    ...movie,
    genre_ids: movie.genre_ids || movie.genres?.map(g => g.id) || []
  }));

  return (
    <PageTemplate
      title="Favorite Movies"
      movies={movies}
      action={(movie) => {
        return (
          <>
            <RemoveFromFavorites movie={movie} />
            <WriteReview movie={movie} />
          </>
        );
      }}
    />
  );
};

export default FavoriteMoviesPage;