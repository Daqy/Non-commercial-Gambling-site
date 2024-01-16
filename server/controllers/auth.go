package controllers

import (
	"net/http"
	"server/environment"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Token struct {
	Token string
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
		c.Abort()
		return
	}

	if !tkn.Valid {
		c.String(http.StatusUnauthorized, "Token is no longer valid.")
		c.Abort()
	}
}