package main

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type movie struct {
	title       string `json:"title"`
	year        uint   `json:"year"`
	reccomender string `json:"reccomender"`
	imdbUrl     string `json:"imdbUrl"`
}

var sample = []movie{
	{title: "star wars", year: 1979, reccomender: "dad", imdbUrl: "test"},
}

func main() {
	port := os.Getenv("PORT")
	router := gin.Default()
	router.GET("/hello", func(c *gin.Context) {
		c.IndentedJSON(http.StatusOK, sample)
	})

	router.Run(":" + port)
}
