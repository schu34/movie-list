CREATE TABLE movies (
  movieId serial PRIMARY KEY,
  title text NOT NULL,
  imdb_url text,
  reccomender text,
  tags jsonb,
	content_type text NOT NULL
);

