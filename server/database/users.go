package database

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type User struct {
	ID       *primitive.ObjectID `bson:"_id,omitempty" json:"omitempty"`
	Username string              `bson:"username,omitempty" json:"username"`
	Email    string              `bson:"email,omitempty" json:"email,omitempty"`
	Password string              `bson:"password,omitempty" json:"password"`
	Balance  float64             `bson:"balance,omitempty" json:"omitempty"`
}

type Token struct {
	ID    *primitive.ObjectID `bson:"_id,omitempty" json:"omitempty"`
	Token string              `bson:"token,omitempty" json:"token"`
}

func FindUser(user *User) error {
	return findOne("users", user)
}

func CreateUser(user User) (*mongo.InsertOneResult, error) {
	return create("users", user)
}

func AddSession(token Token) (*mongo.InsertOneResult, error) {
	return create("sessions", token)
}

func FindSession(token *Token) error {
	return findOne("sessions", token)
}

func DeleteSession(token *Token) (*mongo.DeleteResult, error) {
	return delete("sessions", token)
}
