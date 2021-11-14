-- name: GetMovie :one
SELECT
  *
FROM
  movies
WHERE
  movieId = $1
LIMIT 1;

-- name: ListMovies :many
SELECT
  *
FROM
  movies;

-- name: CreateMovie :one
INSERT INTO movies (title, imdb_url, reccomender, tags, content_type)
  VALUES ($1, $2, $3, $4, $5)
RETURNING
  *;

