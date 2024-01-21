package controllers

import (
	"fmt"
	"net/http"
	"server/database"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Click struct {
	Position int16   `bson:"position,omitempty" json:"position,omitempty"`
	Earned   float64 `bson:"earned,omitempty" json:"earned,omitempty"`
}

type Bomb struct {
	Position []int16 `bson:"position,omitempty" json:"position,omitempty"`
	Count    int16   `bson:"count,omitempty" json:"count,omitempty"`
}

type MinesweeperGameWithOutBomb struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	BelongsTo primitive.ObjectID `bson:"belongsTo,omitempty" json:"belongsTo,omitempty"`
	State     string             `bson:"state,omitempty" json:"state,omitempty"`
	Stake     int64              `bson:"stake,omitempty" json:"stake,omitempty"`
	Pool      float64            `bson:"pool,omitempty" json:"pool,omitempty"`
	GameType  string             `bson:"gameType,omitempty" json:"gameType,omitempty"`
	Clicks    []Click            `bson:"clicks,omitempty" json:"clicks,omitempty"`
}

type MinesweeperGame struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	BelongsTo primitive.ObjectID `bson:"belongsTo,omitempty" json:"belongsTo,omitempty"`
	State     string             `bson:"state,omitempty" json:"state,omitempty"`
	Stake     int64              `bson:"stake,omitempty" json:"stake,omitempty"`
	Pool      float64            `bson:"pool,omitempty" json:"pool,omitempty"`
	GameType  string             `bson:"gameType,omitempty" json:"gameType,omitempty"`
	Clicks    []Click            `bson:"clicks,omitempty" json:"clicks,omitempty"`
	Bomb      Bomb               `bson:"bomb,omitempty" json:"bomb,omitempty"`
}

func (g MinesweeperGame) MarshalBSON() ([]byte, error) {
	if len(g.Bomb.Position) == 0 && g.Bomb.Count == 0 {
		return bson.Marshal(MinesweeperGameWithOutBomb{ID: g.ID, BelongsTo: g.BelongsTo, State: g.State, Stake: g.Stake, Pool: g.Pool, GameType: g.GameType, Clicks: g.Clicks})
	}
	return bson.Marshal(g)
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

	game := MinesweeperGame{ID: objID}

	if err := database.FindGame(&game); err != nil {
		c.String(http.StatusBadRequest, "Failed to find game")
		return
	}

	fmt.Println(game, user.ID)
	if game.BelongsTo != user.ID {
		c.String(http.StatusUnauthorized, "Unauthorized access to game")
		return
	}

	if game.State == "ongoing" {
		game.Bomb.Position = nil
	}

	c.JSON(http.StatusOK, game)
}
