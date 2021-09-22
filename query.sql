-- name: GetMovie :one

select *
from movies
where movieId = $1
limit 1;

-- name: ListMovies :many

select *
from movies;

-- name: CreateMovie :one

insert into movies (title, year, imdb_url, reccomender, tags)
VALUES ($1,
									$2,
									$3,
									$4,
									$5) RETURNING *;