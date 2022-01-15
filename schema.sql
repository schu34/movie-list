CREATE TABLE movies (
  movieId char(10) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  reccomender text,
  image text NOT NULL,
  tags jsonb,
	content_type text NOT NULL
);
