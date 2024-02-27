package controllers

import (
	"encoding/json"
	"fmt"
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

	query := database.User{Email: credentials.Email}
	var user database.User

	if err := database.FindUser(query, &user); err != nil {
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

	if err := database.FindUser(database.User{Username: credentials.Username}, &database.User{}); err == nil {
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
	user, err := getUserFromRequest(c)

	if err != nil {
		c.String(http.StatusNotModified, "Failed get user information.")
		return
	}

	if _, err := database.DeleteSession(&database.Token{Token: user.Token}); err != nil {
		c.String(http.StatusNotModified, "Failed to logout.")
		return
	}

	c.SetCookie("token", "", -1, "", "", false, true)
	c.String(http.StatusCreated, "Successfully logged out.")
}

func GetUser(c *gin.Context) {
	user, err := getUserFromRequest(c)

	if err != nil {
		c.String(http.StatusBadRequest, "Failed get user information.")
		return
	}

	query := database.User{ID: &user.ID}
	var result database.User

	if err := database.FindUser(query, &result); err != nil {
		c.String(http.StatusBadRequest, "Unable to find user from token")
		return
	}

	c.JSON(http.StatusOK, database.User{Username: result.Username, Balance: result.Balance})
}

func getUserFromRequest(c *gin.Context) (User, error) {
	iUser, exist := c.Get("user")
	if !exist {
		return User{}, fmt.Errorf("User doesn't exist on request")
	}

	user, ok := iUser.(User)

	if !ok {
		return User{}, fmt.Errorf("Failed to convert user request to User")
	}

	return user, nil
}
