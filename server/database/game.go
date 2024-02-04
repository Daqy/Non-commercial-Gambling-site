package database

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type GameId struct {
	ID primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
}

func FindGame[T interface{}](game *T) error {
	return findOne("games", game)
}

func FindGames[T interface{}](games *T) ([]T, error) {
	return findMany("games", games)
}
