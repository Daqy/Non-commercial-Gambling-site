package database

import (
	"server/shared"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type GameId struct {
	ID primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
}

func FindGame[Q any, R any](query Q, result *R) error {
	return findOne("games", query, result)
}

func FindGames[Q any, R any](query Q, result *R) (R, error) {
	return findMany("games", query, result)
}

func CreateGame[T interface{}](game T) (*mongo.InsertOneResult, error) {
	return create("games", game)
}

func AddClick[Q any](query Q, clicks []shared.Click) (*mongo.UpdateResult, error) {
	return update("games", query, updateGeneric{
		Key:   "clicks",
		Value: clicks,
	})
}

func UpdateState[Q any](query Q, state string) (*mongo.UpdateResult, error) {
	return update("games", query, updateGeneric{Key: "state", Value: state})
}

func UpdatePool[Q any](query Q, pool float64) (*mongo.UpdateResult, error) {
	return update("games", query, updateGeneric{Key: "pool", Value: pool})
}
