package environment

import (
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Environemnt struct {
	MongoDbUri     string
	MongoDbName    string
	JwtTokenSecret string
}

func (e Environemnt) isEmpty() (string, bool) {
	if e.MongoDbUri == "" {
		return "MONGODB_URI", true
	}
	if e.MongoDbName == "" {
		return "MONGODB_DATABASE_NAME", true
	}
	if e.JwtTokenSecret == "" {
		return "JWT_TOKEN_SECRET", true
	}
	return "", false
}

var Env Environemnt

func Setup() error {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	Env.MongoDbUri = os.Getenv("MONGODB_URI")
	Env.MongoDbName = os.Getenv("MONGODB_DATABASE_NAME")
	Env.JwtTokenSecret = os.Getenv("JWT_TOKEN_SECRET")

	if envName, isEmpty := Env.isEmpty(); isEmpty {
		return errors.New(fmt.Sprintf("[env]: '%s' needs to be set in .env file", envName))
	}

	return nil
}
