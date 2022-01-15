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
INSERT INTO movies (movieId, title, reccomender, tags, content_type, image, description)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING
  *;

