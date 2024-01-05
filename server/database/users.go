package database

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type User struct {
	ID *primitive.ObjectID `bson:"_id,omitempty"`
	Username string `bson:"username,omitempty"`
	Email string `bson:"email,omitempty"`
	Password string `bson:"password,omitempty"`
	Balance float64 `bson:"balance,omitempty"`
}

func FindUser(user *User) error {
	return findOne("users", user)
}

func CreateUser(user User) (*mongo.InsertOneResult, error) {
	return create("users", user)
}