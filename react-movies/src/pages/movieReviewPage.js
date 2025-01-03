import React from "react";
import { useLocation } from "react-router-dom";
import PageTemplate from "../components/templateMoviePage";
import MovieReview from "../components/movieReview";

const MovieReviewPage = () => {
  const location = useLocation();
  const { movie, review } = location.state;

  // Add a check for review data
  if (!review) {
    return (
      <PageTemplate movie={movie}>
        <p>No review found.</p>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate movie={movie}>
      <MovieReview review={review} />
    </PageTemplate>
  );
};

export default MovieReviewPage;