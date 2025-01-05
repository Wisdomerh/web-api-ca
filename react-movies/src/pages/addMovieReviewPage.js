import React from "react";
import PageTemplate from "../components/templateMoviePage";
import ReviewForm from "../components/reviewForm";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";

const WriteReviewPage = () => {
  const location = useLocation();
  console.log("Location state:", location.state); // Debug log

  // Check if we have a movie object in state, if not use movieId
  const movieId = location.state?.movieId;
  console.log("Movie ID:", movieId); // Debug log

  const { data: movie, error, isLoading, isError } = useQuery(
    ["movie", { id: movieId }],
    getMovie,
    {
      enabled: !!movieId, // Only run query if movieId exists
    }
  );

  if (!movieId) {
    return <h1>Error: No movie selected</h1>;
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <PageTemplate movie={movie}>
      <ReviewForm movie={movie} />
    </PageTemplate>
  );
};

export default WriteReviewPage;