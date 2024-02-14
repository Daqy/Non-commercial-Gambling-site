package main

import (
	"log"
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
	auth.POST("/logout", controllers.AuthenticateToken, controllers.Logout)

	api := router.Group("/api")
	api.GET("/hello-world", controllers.AuthenticateToken, controllers.HelloWorld)
	api.GET("/get-user", controllers.AuthenticateToken, controllers.GetUser)

	game := api.Group("/game")
	game.GET("/game-history", controllers.AuthenticateToken, controllers.GetGameHistory)

	minesweeper := game.Group("/minesweeper")
	minesweeper.GET("/:id", controllers.AuthenticateToken, controllers.GetGame)
	minesweeper.GET("/latest-game", controllers.AuthenticateToken, controllers.GetLatestGame)
	minesweeper.POST("/create", controllers.AuthenticateToken, controllers.CreateGame)
	minesweeper.POST("/:id/click", controllers.AuthenticateToken, controllers.GameClick)

	router.Run(":3000")
}

// ----- TODO -------
// Only return required values
