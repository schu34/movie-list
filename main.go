package main

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type movie struct {
	Title       string `json:"Title"`
	Year        uint   `json:"Year"`
	Reccomender string `json:"Reccomender"`
	ImdbUrl     string `json:"ImdbUrl"`
}

var sample = movie{Title: "star wars", Year: 1979, Reccomender: "dad", ImdbUrl: "test"}

func main() {
	port := os.Getenv("PORT")
	router := gin.Default()
	router.GET("/hello", func(c *gin.Context) {
		c.IndentedJSON(http.StatusOK, sample)
	})

	router.Run(":" + port)
}
