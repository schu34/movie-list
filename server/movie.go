package main

import (
	"database/sql"
	"encoding/json"
	"github.com/tabbed/pqtype"
	"schupack.dev/movie-list/db"
)

type Movie struct {
	Id          string   `json:"Id"`
	Title       string   `json:"Title"`
	Description string   `json:"Description"`
	Reccomender string   `json:"Reccomender"`
	Tags        []string `json:"Tags"`
	ContentType string   `json:"ContentType"`
	Image       string   `json:"Image"`
}

func MakeMovieRecord(movie Movie) db.CreateMovieParams {

	tagsValue, err := json.Marshal(movie.Tags)

	if err != nil {
		panic(err)
	}

	return db.CreateMovieParams{
		Movieid:     movie.Id,
		Title:       movie.Title,
		Description: movie.Description,
		Reccomender: sql.NullString{Valid: true, String: movie.Reccomender},
		Tags:        pqtype.NullRawMessage{Valid: true, RawMessage: tagsValue},
		ContentType: movie.ContentType,
		Image:       movie.Image,
	}

}

func MapMoviesFromDbRecords(movieRecs []db.Movie) []Movie {
	ret := make([]Movie, len(movieRecs))

	for i := 0; i < len(movieRecs); i++ {
		ret[i] = MovieFromDbRecord(movieRecs[i])
	}

	return ret
}

func MovieFromDbRecord(movieRec db.Movie) Movie {
	var reccomender string
	var tags []string

	if movieRec.Reccomender.Valid {
		reccomender = movieRec.Reccomender.String
	}

	if movieRec.Tags.Valid {
		err := json.Unmarshal(movieRec.Tags.RawMessage, &tags)
		if err != nil {
			panic("failed to parse json")
		}
	}

	return Movie{
		Id:          movieRec.Movieid,
		Title:       movieRec.Title,
		Description: movieRec.Description,
		Reccomender: reccomender,
		Tags:        tags,
		ContentType: movieRec.ContentType,
		Image:       movieRec.Image,
	}
}
