import React, { useContext } from "react";
import { MoviesContext } from "../../contexts/moviesContext";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import IconButton from "@mui/material/IconButton";

const AddToPlaylist = ({ movie }) => {
  const context = useContext(MoviesContext);

  const handleAddToPlaylist = (e) => {
    e.preventDefault();
    context.addToMustWatch(movie);
  };

  return (
    <IconButton 
      aria-label="add to must watch"
      onClick={handleAddToPlaylist}
    >
      <PlaylistAddIcon 
        color="primary" 
        fontSize="large"
      />
    </IconButton>
  );
};

export default AddToPlaylist;