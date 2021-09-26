CREATE TABLE movies (
  movieId serial PRIMARY KEY,
  title text NOT NULL,
  year int,
  imdb_url text,
  reccomender text,
  tags jsonb,
	is_tv BOOLEAN not null
);

