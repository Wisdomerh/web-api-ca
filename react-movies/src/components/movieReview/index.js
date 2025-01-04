import React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const MovieReview = ({ review }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, m: 2 }}>
      <Typography variant="h5" component="h3" gutterBottom>
        Review By: {review.author}
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        {review.content}  {/* TMDB API uses 'content' for the review text */}
      </Typography>

      <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
        Posted: {new Date(review.created_at).toLocaleDateString()}
      </Typography>
    </Paper>
  );
};

export default MovieReview;