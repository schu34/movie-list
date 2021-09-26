package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
)

type result struct {
	Id          string `json:"id"`
	ResultType  string `json:"resultType"`
	Image       string `json:"image"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type SearchResponse struct {
	SearchType string   `json:"searchType"`
	Expression string   `json:"expression"`
	Results    []result `json:"results"`
}

func getImdbApiKey() string {
	key, found := os.LookupEnv("IMDB_API_KEY")
	if !found {
		panic("couldn't find imdb api key")
	}

	return key
}

func ImdbSearch(searchTerm string) (SearchResponse, error) {

	response, err := http.Get("https://imdb-api.com/en/API/Search/" + getImdbApiKey() + "/" + searchTerm)

	var sr SearchResponse

	if err != nil {
		return sr, err
	}

	if response.StatusCode != 200 {
		return sr, errors.New("unexpected status returned from api" + strconv.Itoa(response.StatusCode))
	}

	responseBody, err := ioutil.ReadAll(response.Body)

	if err != nil {
		return sr, err
	}

	fmt.Printf("responseBody: %s", responseBody)

	json.Unmarshal(responseBody, &sr)

	return sr, nil

}
