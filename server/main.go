package main

import (
	"server/controllers"

	"github.com/gin-gonic/gin"
)


func main() {
	router := gin.Default()

	API := router.Group("/api")
	API.GET("/hello-world", controllers.HelloWorld)
	
	router.Run(":3000")
}