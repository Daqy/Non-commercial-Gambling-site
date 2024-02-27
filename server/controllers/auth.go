package controllers

import (
	"net/http"
	"server/database"
	"server/environment"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Token struct {
	Token string
}

type User struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"omitempty"`
	Username string             `bson:"username,omitempty" json:"username"`
	Token    string             `bson:"token,omitempty" json:"username"`
}

func (t Token) isEmpty() bool {
	return t.Token == ""
}

func AuthenticateToken(c *gin.Context) {
	var token Token

	cookie, err := c.Cookie("token")

	if err != nil {
		if err := c.BindJSON(&token); err != nil {
			c.String(http.StatusBadRequest, "Token required for authentication.")
			c.Abort()
			return
		}
	} else {
		token.Token = cookie
	}

	if token.isEmpty() {
		c.String(http.StatusForbidden, "Token required for authentication.")
		c.Abort()
		return
	}

	claims := &Claims{}

	if err := database.FindSession(database.Token{Token: token.Token}, &database.Token{}); err != nil {
		c.String(http.StatusUnauthorized, "Token is no longer valid.")
		c.Abort()
		return
	}

	tkn, err := jwt.ParseWithClaims(token.Token, claims, func(t *jwt.Token) (any, error) {
		return []byte(environment.Env.JwtTokenSecret), nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			c.String(http.StatusUnauthorized, "Token signature is invalid.")
			c.Abort()
			return
		}

		c.String(http.StatusBadRequest, "Token has expired.")

		if _, err := database.DeleteSession(&database.Token{Token: token.Token}); err != nil {
			c.String(http.StatusNotModified, "Failed to delete session from database.")
		}

		c.Abort()
		return
	}

	if !tkn.Valid {
		c.String(http.StatusUnauthorized, "Token is no longer valid.")
		c.Abort()
	}

	c.Set("user", User{ID: claims.ID, Username: claims.Username, Token: token.Token})
}

func HandleAuth(c *gin.Context) {
	_, err := getUserFromRequest(c)
	if err != nil {
		c.String(http.StatusBadRequest, "Failed get user information.")
		return
	}

	c.Status(http.StatusOK)
}
