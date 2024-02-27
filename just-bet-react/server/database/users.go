package database

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type User struct {
	ID       *primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	Username string              `bson:"username,omitempty" json:"username"`
	Email    string              `bson:"email,omitempty" json:"email,omitempty"`
	Password string              `bson:"password,omitempty" json:"password,omitempty"`
	Balance  float64             `bson:"balance,omitempty" json:"balance"`
}

type Token struct {
	ID    *primitive.ObjectID `bson:"_id,omitempty" json:"omitempty"`
	Token string              `bson:"token,omitempty" json:"token"`
}

func FindUser(user User, result *User) error {
	return findOne("users", user, result)
}

func CreateUser(user User) (*mongo.InsertOneResult, error) {
	return create("users", user)
}

func AddSession(token Token) (*mongo.InsertOneResult, error) {
	return create("sessions", token)
}

func FindSession(token Token, result *Token) error {
	return findOne("sessions", token, result)
}

func DeleteSession(token *Token) (*mongo.DeleteResult, error) {
	return delete("sessions", token)
}

func UpdateUserBalance(user User, balance float64) (*mongo.UpdateResult, error) {
	return update("users", user, updateGeneric{
		Key:   "balance",
		Value: balance,
	})
}
