package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"github.com/tabbed/pqtype"
	"schupack.dev/movie-list/db"
)

// var dbUrl = "postgres://postgres:@localhost:5432/movie-list?sslmode=disable"

type Movie struct {
	Title       string   `json:"Title"`
	Reccomender string   `json:"Reccomender"`
	Id          string   `json:"Id"`
	Tags        []string `json:"Tags"`
	ContentType string   `json:"ContentType"`
}

// var sample = Movie{Title: "star wars", Year: 1979, Reccomender: "dad", ImdbUrl: "test", Tags: []string{"sci-fi"}}

func main() {
	dburl, found := os.LookupEnv("DATABASE_URL")

	if !found {
		dburl = "user=matthew dbname=movie-list sslmode=disable"
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

	// config := cors.DefaultConfig()
	// config.AllowOrigins = []string{"http://localhost:1234"}
	// config.AllowMethods = []string{"POST"}

	router.Use(cors.Default())

	router.Use(static.Serve("/", static.LocalFile("./dist", true)))

	router.GET("/movies", func(c *gin.Context) {
		movies, err := queries.ListMovies(c)

		if err != nil {
			c.IndentedJSON(http.StatusInternalServerError, err)
		}
		c.IndentedJSON(http.StatusOK, movies)
	})

	router.GET("/movie/:id", func(c *gin.Context) {
		id, err := strconv.Atoi(c.Param("id"))

		if err != nil {
			c.AbortWithStatus(http.StatusBadRequest)
		}

		movie, err := queries.GetMovie(c, int32(id))

		if err != nil {
			c.IndentedJSON(http.StatusInternalServerError, err)
		}

		c.IndentedJSON(http.StatusOK, movie)
	})

	router.POST("/movie", func(c *gin.Context) {

		var movie Movie

		c.BindJSON(&movie)

		result, err := queries.CreateMovie(c, makeMovieRecord(movie))

		if err != nil {
			println(err)
			c.IndentedJSON(http.StatusInternalServerError, err)
			return
		}

		c.IndentedJSON(http.StatusOK, result)

	})

	router.GET("/search/:search", func(c *gin.Context) {
		response, err := ImdbSearch(c.Param("search"))

		if err != nil {
			c.IndentedJSON(http.StatusInternalServerError, err)
		}

		c.IndentedJSON(http.StatusOK, response)

	})

	count := 0
	router.GET("/hello", func(c *gin.Context) {
		count++
		c.IndentedJSON(http.StatusOK, "world "+strconv.Itoa(count))
	})

	router.Run(":" + port)
}

func getStringFromBody(c *gin.Context, key string) sql.NullString {
	value := c.PostForm(key)
	return sql.NullString{Valid: value != "", String: value}
}

func getJSONFromBody(c *gin.Context, key string) pqtype.NullRawMessage {
	value := json.RawMessage(c.PostForm("Tags"))
	return pqtype.NullRawMessage{Valid: json.Valid((value)), RawMessage: value}
}

func makeMovieRecord(movie Movie) db.CreateMovieParams {

	ImdbUrl := "https://www.imdb.com/title/" + movie.Id

	tagsValue, err := json.Marshal(movie.Tags)

	if err != nil {
		panic(err)
	}

	return db.CreateMovieParams{
		Title:       movie.Title,
		Reccomender: sql.NullString{Valid: true, String: movie.Reccomender},
		ImdbUrl:     sql.NullString{Valid: true, String: ImdbUrl},
		Tags:        pqtype.NullRawMessage{Valid: true, RawMessage: tagsValue},
		ContentType: movie.ContentType,
	}

}
