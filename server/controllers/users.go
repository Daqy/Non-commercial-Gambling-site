package controllers

import (
	"encoding/json"
	"net/http"
	"server/database"
	"server/environment"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type Claims struct {
	ID       primitive.ObjectID `json:"_id"`
	Username string             `json:"username"`
	jwt.RegisteredClaims
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func Login(c *gin.Context) {
	var credentials database.User

	if err := json.NewDecoder(c.Request.Body).Decode(&credentials); err != nil {
		c.String(http.StatusBadRequest, "Invalid format of body.")
		return
	}

	if credentials.Username == "" {
		c.String(http.StatusBadRequest, "Username must not be empty.")
		return
	}

	if credentials.Password == "" {
		c.String(http.StatusBadRequest, "Password must not be empty.")
		return
	}

	user := database.User{Username: credentials.Username, Email: credentials.Email}

	if err := database.FindUser(&user); err != nil {
		c.String(http.StatusNotFound, "Invalid username or password.")
		return
	}

	if ok := CheckPasswordHash(credentials.Password, user.Password); !ok {
		c.String(http.StatusNotFound, "Invalid username or password.")
		return
	}

	expirationTime := time.Now().Add(time.Hour)

	claims := &Claims{
		ID:       *user.ID,
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(environment.Env.JwtTokenSecret))

	if err != nil {
		c.String(http.StatusInternalServerError, "Failed to create JWT token.")
		return
	}

	_, err = database.AddSession(database.Token{Token: tokenString})

	if err != nil {
		c.String(http.StatusNotModified, "Failed to add user session.")
		return
	}

	c.SetCookie("token", tokenString, 0, "", "", false, true)
	c.JSON(http.StatusOK, Token{Token: tokenString})
}

func Register(c *gin.Context) {
	var credentials database.User

	if err := json.NewDecoder(c.Request.Body).Decode(&credentials); err != nil {
		c.String(http.StatusBadRequest, "Invalid format of body.")
		return
	}

	if credentials.Username == "" {
		c.String(http.StatusBadRequest, "Username must not be empty.")
		return
	}

	if credentials.Email == "" {
		c.String(http.StatusBadRequest, "Email must not be empty.")
		return
	}

	if credentials.Password == "" {
		c.String(http.StatusBadRequest, "Password must not be empty.")
		return
	}

	if err := database.FindUser(&database.User{Username: credentials.Username}); err == nil {
		c.String(http.StatusNotFound, "User already Exist.")
		return
	}

	hash, err := HashPassword(credentials.Password)

	if err != nil {
		c.JSON(http.StatusInternalServerError, "")
		return
	}

	credentials.Password = hash

	result, err := database.CreateUser(credentials)

	if err != nil {
		c.String(http.StatusNotModified, "Failed to create user.")
		return
	}

	expirationTime := time.Now().Add(time.Hour)
	id, ok := result.InsertedID.(primitive.ObjectID)

	if !ok {
		c.String(http.StatusNotModified, "Failed to modify ID")
		return
	}

	claims := &Claims{
		ID:       id,
		Username: credentials.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(environment.Env.JwtTokenSecret))

	if err != nil {
		c.String(http.StatusInternalServerError, "Failed to create JWT token.")
		return
	}

	_, err = database.AddSession(database.Token{Token: tokenString})

	if err != nil {
		c.String(http.StatusNotModified, "Failed to add user session.")
		return
	}

	c.SetCookie("token", tokenString, 0, "", "", false, true)
	c.JSON(http.StatusCreated, Token{Token: tokenString})
}

func Logout(c *gin.Context) {
	var token Token

	if err := json.NewDecoder(c.Request.Body).Decode(&token); err != nil {
		c.String(http.StatusBadRequest, "Invalid format of body.")
		return
	}

	if token.isEmpty() {
		c.String(http.StatusBadRequest, "Token is required.")
		return
	}

	if _, err := database.DeleteSession(&database.Token{Token: token.Token}); err != nil {
		c.String(http.StatusNotModified, "Failed to logout.")
		return
	}

	c.SetCookie("token", "", -1, "", "", false, true)
	c.String(http.StatusCreated, "Successfully logged out.")
}
