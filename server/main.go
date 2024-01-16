package main

import (
	"log"
	"net/http"
	"server/controllers"
	"server/database"
	"server/environment"

	"github.com/gin-gonic/gin"
)

func main() {
	if err := environment.Setup(); err != nil {
		log.Panicf("Error getting environment variables: %v", err)
		return
	}

	if err := database.Setup(); err != nil {
		log.Panicf("Error setting up databse: %v", err)
		return
	}

	router := gin.Default()

	auth := router.Group("/auth")
	auth.POST("/login", controllers.Login)
	auth.POST("/register", controllers.Register)

	api := router.Group("/api")
	api.GET("/hello-world", controllers.AuthenticateToken, controllers.HelloWorld)
	api.GET("/get-user", func (c *gin.Context) {
		user := database.User{Username: "Daqy"}

		if err := database.FindUser(&user); err != nil {
			c.String(http.StatusNotFound, "Unable to find user")
		}
		c.JSON(http.StatusOK, user)
	})

	
	router.Run(":3000")
}
