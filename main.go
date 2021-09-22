package main

import (
	"database/sql"
	"encoding/json"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/tabbed/pqtype"
	"schupack.dev/movie-list/db"
)

// var dbUrl = "postgres://postgres:@localhost:5432/movie-list?sslmode=disable"

type Movie struct {
	Title       string   `json:"Title"`
	Year        uint     `json:"Year"`
	Reccomender string   `json:"Reccomender"`
	ImdbUrl     string   `json:"ImdbUrl"`
	Tags        []string `json:"Tags"`
}

// var sample = Movie{Title: "star wars", Year: 1979, Reccomender: "dad", ImdbUrl: "test", Tags: []string{"sci-fi"}}

func main() {
	dburl, found := os.LookupEnv("DATABASE_URL")

	if !found {
		dburl = "user=postgres dbname=movie-list sslmode=disable"
	}

	var dbp, err = sql.Open("postgres", dburl)
	if err != nil {
		panic(err)
	}
	queries := db.New(dbp)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	router := gin.Default()
	router.GET("/movies", func(c *gin.Context) {
		movies, err := queries.ListMovies(c)

		if err != nil {
			panic(err)
		}
		c.IndentedJSON(200, movies)
	})

	router.GET("/movie/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))

		if err != nil {
			panic(err)
		}

		movie, err := queries.GetMovie(c, int32(id))

		if err != nil {
			panic(err)
		}

		c.IndentedJSON(200, movie)
	})

	router.POST("/movie", func(c *gin.Context) {

		result, err := queries.CreateMovie(c, db.CreateMovieParams{
			Title:       c.PostForm("Title"),
			Year:        getInt32FromBody(c, "Year"),
			Reccomender: getStringFromBody(c, "Reccomender"),
			ImdbUrl:     getStringFromBody(c, "ImdbUrl"),
			Tags:        getJSONFromBody(c, "Tags"),
		})

		if err != nil {
			c.AbortWithError(500, err)
			return
		}

		c.IndentedJSON(200, result)

	})

	router.Run(":" + port)
}

func getInt32FromBody(c *gin.Context, key string) sql.NullInt32 {
	value, err := strconv.Atoi(c.PostForm(key))
	return sql.NullInt32{Valid: err == nil, Int32: int32(value)}
}

func getStringFromBody(c *gin.Context, key string) sql.NullString {
	value := c.PostForm(key)
	return sql.NullString{Valid: value != "", String: value}
}

func getJSONFromBody(c *gin.Context, key string) pqtype.NullRawMessage {
	value := json.RawMessage(c.PostForm("Tags"))
	return pqtype.NullRawMessage{Valid: json.Valid((value)), RawMessage: value}

}
