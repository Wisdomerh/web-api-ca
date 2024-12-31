import React from "react";
import { useQuery } from "react-query";
import { getMovieCredits } from "../../api/tmdb-api";
import { Paper, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import Spinner from '../spinner';
import { Link } from "react-router-dom";

const MovieCredits = ({ movie }) => {
  const { data, error, isLoading, isError } = useQuery(
    ["credits", { id: movie.id }],
    () => getMovieCredits(movie.id)
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  // JSX for rendering the movie credits (cast)
  return (
    <Paper sx={{ padding: 2, margin: 2 }}>  {}
      <Typography variant="h5" gutterBottom> 
        Cast {}
      </Typography>
      <Grid container spacing={2}> {/* Layout grid to display actors */}
        {data.cast.slice(0, 6).map((actor) => (  // Map through first 6 actors from the data
          <Grid item xs={6} md={2} key={actor.id}>  {/* Grid item for each actor card */}
            <Card sx={{ height: '100%' }}> {/* Card to contain actor's info */}
              <CardMedia
                component="img"
                height="200"
                image={ 
                  actor.profile_path 
                    ? `https://image.tmdb.org/t/p/w500/${actor.profile_path}`  // Use actor's image if available
                    : "/profile-placeholder.jpg"  // Default placeholder image
                }
                alt={actor.name}  // Actor's name as alt text for the image
              />
              <CardContent>
                <Typography variant="subtitle1" component="div">
                  <Link to={`/person/${actor.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {actor.name}  {/* Actor's name with link to their profile */}
                  </Link>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {actor.character}  {/* Actor's role in the movie */}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default MovieCredits;
