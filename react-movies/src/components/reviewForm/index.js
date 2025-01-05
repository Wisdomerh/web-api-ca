import React, { useState, useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useForm, Controller } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const ratings = [
  { value: 5, label: "Excellent" },
  { value: 4, label: "Good" },
  { value: 3, label: "Average" },
  { value: 2, label: "Poor" },
  { value: 1, label: "Terrible" },
];

const styles = {
  root: {
    marginTop: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
  },
  form: {
    width: "100%",
    "& > * ": {
      marginTop: 2,
    },
  },
  snack: {
    width: "50%",
    "& > * ": {
      width: "100%",
    },
  },
};

const ReviewForm = ({ movie }) => {
  const { addToFavorites } = useContext(MoviesContext); // Access the context
  const [rating, setRating] = useState(3);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const defaultValues = {
    author: "",
    review: "",
    rating: "3",
  };

  const handleSnackClose = () => {
    setOpen(false);
    navigate("/movies/favorites");
  };

  const { control, formState: { errors }, handleSubmit, reset } = useForm({
    defaultValues,
  });

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const onSubmit = async (data) => {
    try {
      // Use context to interact with favorites or reviews
      addToFavorites(movie); // Example: Add the movie to favorites (optional)

      console.log("Submitting review:", {
        movieId: movie.id,
        review: data.review,
        rating,
      });

      // Simulate adding a review (replace this with your actual API call or context function)
      setTimeout(() => {
        setOpen(true);
        navigate(`/movies/${movie.id}`);
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to submit review");
    }
  };

  return (
    <Box component="div" sx={styles.root}>
      <Typography component="h2" variant="h3">
        Write a review
      </Typography>

      <Snackbar
        sx={styles.snack}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        onClose={handleSnackClose}
      >
        <MuiAlert
          severity="success"
          variant="filled"
          onClose={handleSnackClose}
        >
          <Typography variant="h4">
            Thank you for submitting a review
          </Typography>
        </MuiAlert>
      </Snackbar>

      {error && (
        <MuiAlert severity="error" sx={{ mb: 2 }}>
          {error}
        </MuiAlert>
      )}

      <form sx={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="review"
          control={control}
          rules={{
            required: "Review cannot be empty.",
            minLength: { value: 10, message: "Review is too short" },
          }}
          render={({ field: { onChange, value } }) => (
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="review"
              value={value}
              onChange={onChange}
              label="Review text"
              id="review"
              multiline
              minRows={10}
            />
          )}
        />
        {errors.review && (
          <Typography variant="h6" component="p" color="error">
            {errors.review.message}
          </Typography>
        )}

        <Controller
          control={control}
          name="rating"
          render={() => (
            <TextField
              id="select-rating"
              select
              variant="outlined"
              label="Rating Select"
              value={rating}
              onChange={handleRatingChange}
              helperText="Don't forget your rating"
            >
              {ratings.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Box>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
          <Button
            type="reset"
            variant="contained"
            color="secondary"
            onClick={() => {
              reset({ review: "" });
              setRating(3);
            }}
          >
            Reset
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ReviewForm;
