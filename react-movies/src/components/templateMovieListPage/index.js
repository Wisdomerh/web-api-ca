import React, { useState } from "react";
import Header from "../headerMovieList";
import FilterCard from "../filterMoviesCard";
import MovieList from "../movieList";
import Grid from "@mui/material/Grid2";

function MovieListPageTemplate({ movies, title, action }) {
  const [nameFilter, setNameFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("0");
  const [sortBy, setSortBy] = useState("default");
  const genreId = Number(genreFilter);

  let displayedMovies = movies
    .filter((m) => {
      return m.title.toLowerCase().search(nameFilter.toLowerCase()) !== -1;
    })
    .filter((m) => {
      return genreId > 0 ? m.genre_ids.includes(genreId) : true;
    });

  // Sort movies after filtering
  const sortMovies = (moviesToSort) => {
    const sorted = [...moviesToSort];
    
    switch (sortBy) {
      case "title-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "rating-desc":
        return sorted.sort((a, b) => b.vote_average - a.vote_average);
      case "rating-asc":
        return sorted.sort((a, b) => a.vote_average - b.vote_average);
      case "release-desc":
        return sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      case "release-asc":
        return sorted.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
      default:
        return sorted;
    }
  };

  const handleChange = (type, value) => {
    if (type === "name") setNameFilter(value);
    else if (type === "genre") setGenreFilter(value);
    else if (type === "sort") setSortBy(value);
  };

  const sortedMovies = sortMovies(displayedMovies);

  return (
    <Grid container>
      <Grid size={12}>
        <Header title={title} />
      </Grid>
      <Grid container sx={{flex: "1 1 500px"}}>
        <Grid 
          key="find" 
          size={{xs: 12, sm: 6, md: 4, lg: 3, xl: 2}} 
          sx={{padding: "20px"}}
        >
          <FilterCard
            onUserInput={handleChange}
            titleFilter={nameFilter}
            genreFilter={genreFilter}
            sortBy={sortBy}
          />
        </Grid>
        <MovieList action={action} movies={sortedMovies}></MovieList>
      </Grid>
    </Grid>
  );
}
export default MovieListPageTemplate;