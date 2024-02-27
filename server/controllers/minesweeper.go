package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"server/database"
	"server/shared"
	"server/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Bomb struct {
	Position []int `bson:"position,omitempty" json:"position,omitempty"`
	Count    int   `bson:"count,omitempty" json:"count,omitempty"`
}

type MinesweeperGameWithOutBomb struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	BelongsTo primitive.ObjectID `bson:"belongsTo,omitempty" json:"belongsTo,omitempty"`
	State     string             `bson:"state,omitempty" json:"state,omitempty"`
	Stake     int                `bson:"stake,omitempty" json:"stake,omitempty"`
	Pool      float64            `bson:"pool,omitempty" json:"pool,omitempty"`
	GameType  string             `bson:"gameType,omitempty" json:"gameType,omitempty"`
	Clicks    []shared.Click     `bson:"clicks,omitempty" json:"clicks,omitempty"`
}

type MinesweeperGame struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	BelongsTo primitive.ObjectID `bson:"belongsTo,omitempty" json:"belongsTo,omitempty"`
	State     string             `bson:"state,omitempty" json:"state,omitempty"`
	Stake     int                `bson:"stake,omitempty" json:"stake,omitempty"`
	Pool      float64            `bson:"pool,omitempty" json:"pool,omitempty"`
	GameType  string             `bson:"gameType,omitempty" json:"gameType,omitempty"`
	Clicks    []shared.Click     `bson:"clicks,omitempty" json:"clicks,omitempty"`
	Bomb      Bomb               `bson:"bomb,omitempty" json:"bomb,omitempty"`
}

func GetGame(c *gin.Context) {
	user, err := getUserFromRequest(c)

	if err != nil {
		c.String(http.StatusBadRequest, "Failed get user information.")
		return
	}

	gameid := c.Param("id")

	if gameid == "" {
		c.String(http.StatusBadRequest, "ID must be provided.")
		return
	}

	if len(gameid) != 24 {
		c.String(http.StatusBadRequest, "ID must be provided.")
		return
	}

	objID, err := primitive.ObjectIDFromHex(gameid)
	if err != nil {
		panic(err)
	}

	query := MinesweeperGameWithOutBomb{ID: objID, GameType: "minesweeper"}
	var game MinesweeperGame

	if err := database.FindGame(query, &game); err != nil {
		c.String(http.StatusBadRequest, "Failed to find game")
		return
	}

	if game.BelongsTo != user.ID {
		c.String(http.StatusUnauthorized, "Unauthorized access to game")
		return
	}

	if game.State == "ongoing" {
		game.Bomb.Position = nil
	}

	c.JSON(http.StatusOK, game)
}

func GetLatestGame(c *gin.Context) {
	user, err := getUserFromRequest(c)

	if err != nil {
		c.String(http.StatusBadRequest, "Failed get user information.")
		return
	}

	query := MinesweeperGameWithOutBomb{BelongsTo: user.ID, GameType: "minesweeper"}
	var result []MinesweeperGame

	games, err := database.FindGames(query, &result)
	if err != nil {
		c.String(http.StatusBadRequest, "Failed to find game")
		return
	}

	if len(games) == 0 {
		c.String(http.StatusUnauthorized, "No games found")
		return
	}

	latestGame := games[len(games)-1]

	if latestGame.State == "ongoing" {
		latestGame.Bomb.Position = nil
	}

	c.JSON(http.StatusOK, latestGame)
}

func getMinesweeperHistory(user User) ([]MinesweeperGame, error) {
	query := MinesweeperGameWithOutBomb{BelongsTo: user.ID, GameType: "minesweeper", State: "done"}
	var result []MinesweeperGame

	games, err := database.FindGames(query, &result)

	if err != nil {
		return nil, errors.New("Failed to find game")
	}

	if len(games) == 0 {
		return nil, errors.New("No games found")
	}

	if len(games) > 50 {
		games = games[len(games)-51 : len(games)-1]
	}

	return games, nil
}

type CreateGameInfo struct {
	BombCount int `json:"bombCount,omitempty"`
	Stake     int `json:"stake,omitempty"`
}

func CreateGame(c *gin.Context) {
	user, err := getUserFromRequest(c)

	if err != nil {
		c.String(http.StatusBadRequest, "Failed get user information.")
		return
	}

	var gameInfo CreateGameInfo

	if err := json.NewDecoder(c.Request.Body).Decode(&gameInfo); err != nil {
		c.String(http.StatusBadRequest, "Invalid format of body.")
		return
	}

	if gameInfo.BombCount == 0 {
		c.String(http.StatusBadRequest, "Bomb count must not be empty.")
		return
	}

	if gameInfo.Stake == 0 {
		c.String(http.StatusBadRequest, "Stake must not be empty.")
		return
	}

	query := MinesweeperGameWithOutBomb{BelongsTo: user.ID, GameType: "minesweeper", State: "ongoing"}
	var result []MinesweeperGame

	games, err := database.FindGames(query, &result)

	if err != nil {
		c.String(http.StatusBadRequest, "Failed to find game")
		return
	}

	if len(games) != 0 {
		c.String(http.StatusForbidden, "User is already in a game")
		return
	}

	game := MinesweeperGame{
		BelongsTo: user.ID,
		State:     "ongoing",
		Stake:     gameInfo.Stake,
		Pool:      float64(gameInfo.Stake),
		GameType:  "minesweeper",
		Bomb: Bomb{
			Position: utils.GenerateBombPosition(gameInfo.BombCount),
			Count:    gameInfo.BombCount,
		},
	}

	gameModified, err := database.CreateGame(game)

	if err != nil {
		c.String(http.StatusNotModified, "Failed to create game.")
		return
	}

	userQuery := database.User{ID: &user.ID}
	var userR database.User

	if err := database.FindUser(userQuery, &userR); err != nil {
		c.String(http.StatusBadRequest, "Unable to find user from token")
		return
	}

	database.UpdateUserBalance(userQuery, userR.Balance-float64(gameInfo.Stake))

	c.JSON(http.StatusCreated, gameModified)
}

type ClickPosition struct {
	ClickPosition int
}

func GameClick(c *gin.Context) {
	user, err := getUserFromRequest(c)

	if err != nil {
		c.String(http.StatusBadRequest, "Failed get user information.")
		return
	}

	gameid := c.Param("id")

	if gameid == "" {
		c.String(http.StatusBadRequest, "Game id is required for this request.")
		return
	}

	if len(gameid) != 24 {
		c.String(http.StatusBadRequest, "ID must be provided.")
		return
	}

	// ClickPositionString, exist := c.Get("clickPosition")
	var requestInfo ClickPosition

	if err := json.NewDecoder(c.Request.Body).Decode(&requestInfo); err != nil {
		c.String(http.StatusBadRequest, "Invalid format of body.")
		return
	}

	clickPosition := requestInfo.ClickPosition

	objID, err := primitive.ObjectIDFromHex(gameid)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	query := MinesweeperGameWithOutBomb{ID: objID, GameType: "minesweeper"}
	var game MinesweeperGame

	if err := database.FindGame(query, &game); err != nil {
		c.String(http.StatusBadRequest, "Failed to find game")
		return
	}

	if game.BelongsTo != user.ID {
		c.String(http.StatusUnauthorized, "Unauthorized access to game.")
		return
	}

	if game.State == "done" {
		c.String(http.StatusForbidden, "Game is finished.")
		return
	}

	if utils.HasBeenClickedMinesweeper(clickPosition, game.Clicks) {
		c.String(http.StatusBadRequest, "Position has already been clicked.")
		return
	}

	chanceOfWinning := utils.GetPercentageOfWinningGame(25, len(game.Clicks)+1, game.Bomb.Count)
	pool := (1.0 / chanceOfWinning) * float64(game.Stake)
	earned := pool - game.Pool

	clicks := append(game.Clicks, shared.Click{
		Position: clickPosition,
		Earned:   earned,
	})

	database.AddClick(MinesweeperGameWithOutBomb{ID: objID, GameType: "minesweeper"}, clicks)

	// Game lost (bomb clicked)
	if utils.ValueInArray(game.Bomb.Position, clickPosition) {
		database.UpdateState(MinesweeperGameWithOutBomb{ID: objID, GameType: "minesweeper"}, "done")
		queryGame := MinesweeperGameWithOutBomb{ID: objID, GameType: "minesweeper"}
		if err := database.FindGame(queryGame, &game); err != nil {
			c.String(http.StatusBadRequest, "Failed to find game")
			return
		}
		c.JSON(http.StatusOK, game)
		return
	}

	database.UpdatePool(MinesweeperGameWithOutBomb{ID: objID, GameType: "minesweeper"}, pool)

	// Game Won
	// 25 = default board size (won't have the option of changing it rn)
	fmt.Println(len(game.Clicks)+1, 25-game.Bomb.Count)
	if len(game.Clicks)+1 == 25-game.Bomb.Count {
		database.UpdateState(MinesweeperGameWithOutBomb{ID: objID, GameType: "minesweeper"}, "done")

		query := database.User{ID: &user.ID}
		var result database.User

		if err := database.FindUser(query, &result); err != nil {
			c.String(http.StatusBadRequest, "Unable to find user from token")
			return
		}

		database.UpdateUserBalance(query, result.Balance+earned)
		queryGame := MinesweeperGameWithOutBomb{ID: objID, GameType: "minesweeper"}
		if err := database.FindGame(queryGame, &game); err != nil {
			c.String(http.StatusBadRequest, "Failed to find game")
			return
		}
		c.JSON(http.StatusOK, game)
		return
	}

	// Continue Game (get latest game version)
	query = MinesweeperGameWithOutBomb{ID: objID, GameType: "minesweeper"}
	if err := database.FindGame(query, &game); err != nil {
		c.String(http.StatusBadRequest, "Failed to find game")
		return
	}

	if game.State == "ongoing" {
		game.Bomb.Position = nil
	}

	c.JSON(http.StatusOK, game)
}

func ClaimGame(c *gin.Context) {
	user, err := getUserFromRequest(c)

	if err != nil {
		c.String(http.StatusBadRequest, "Failed get user information.")
		return
	}

	gameid := c.Param("id")

	if gameid == "" {
		c.String(http.StatusBadRequest, "Game id is required for this request.")
		return
	}

	if len(gameid) != 24 {
		c.String(http.StatusBadRequest, "ID must be provided.")
		return
	}

	objID, err := primitive.ObjectIDFromHex(gameid)
	if err != nil {
		c.Status(http.StatusBadRequest)
		return
	}

	gameQuery := MinesweeperGameWithOutBomb{ID: objID, GameType: "minesweeper"}
	var game MinesweeperGame

	if err := database.FindGame(gameQuery, &game); err != nil {
		c.String(http.StatusBadRequest, "Failed to find game")
		return
	}

	database.UpdateState(MinesweeperGameWithOutBomb{ID: objID, GameType: "minesweeper"}, "done")

	query := database.User{ID: &user.ID}
	var result database.User

	if err := database.FindUser(query, &result); err != nil {
		c.String(http.StatusBadRequest, "Unable to find user from token")
		return
	}

	database.UpdateUserBalance(query, result.Balance+game.Pool)

	if err := database.FindGame(gameQuery, &game); err != nil {
		c.String(http.StatusBadRequest, "Failed to find game")
		return
	}

	c.JSON(http.StatusOK, game)
}
