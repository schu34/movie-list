// Code generated by sqlc. DO NOT EDIT.

package db

import (
	"database/sql"

	"github.com/tabbed/pqtype"
)

type Movie struct {
	Movieid     string
	Title       string
	Description string
	Reccomender sql.NullString
	Image       string
	Tags        pqtype.NullRawMessage
	ContentType string
}
