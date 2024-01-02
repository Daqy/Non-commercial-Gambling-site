package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func HelloWorld(ctx *gin.Context) {
	ctx.String(http.StatusOK, "Hello world! 🙌")
}