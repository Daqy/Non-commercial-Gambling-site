package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetGameHistory(c *gin.Context) {
	user, err := getUserFromRequest(c)

	if err != nil {
		c.String(http.StatusBadRequest, "Failed get user information.")
		return
	}

	var history interface{}

	minesweeperGames, err := getMinesweeperHistory(user)

	if err != nil {
		c.String(http.StatusBadRequest, err.Error())
		return
	}

	history = minesweeperGames

	c.JSON(http.StatusOK, history)

}
