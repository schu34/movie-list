import React from "react";

import { apiUrl } from "./constants.js";

const useMovieList = () => {
  const [movies, setMovies] = React.useState(null);

  React.useEffect(() => {
    const fetchMovies = async () => {
      const jsonResponse = await fetch(`${apiUrl}/movies`).then((response) =>
        response.json()
      );
      console.log(jsonResponse);
      setMovies(jsonResponse);
    };
    fetchMovies();
  }, []);

  return movies;
};

export default useMovieList;
