package main

import (
	"log"
	"net/http"
	"server/controllers"
	"server/database"

	"github.com/gin-gonic/gin"
)


func main() {
	if err := database.Setup(); err != nil {
		log.Panicf("Error setting up databse: %v", err)
	}

	router := gin.Default()

	auth := router.Group("/auth")
	auth.POST("/register", func(ctx *gin.Context) {
		user := database.User{Username: "Daqy", Email: "c@c.c", Password: "test", Balance: 100}
		
		userid, err := database.CreateUser(user)

		if err != nil {
			ctx.JSON(http.StatusNotModified, "")
		}
		ctx.JSON(http.StatusOK, userid)
	})
	
	api := router.Group("/api")
	api.GET("/hello-world", controllers.HelloWorld)
	api.GET("/get-user", func (ctx *gin.Context) {
		user := database.User{Username: "Daqy"}

		if err := database.FindUser(&user); err != nil {
			ctx.JSON(http.StatusNotFound, "")
		}
		ctx.JSON(http.StatusOK, user)
	})

	
	router.Run(":3000")
}