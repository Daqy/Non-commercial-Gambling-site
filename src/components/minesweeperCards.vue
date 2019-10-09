<template>
  <div class="main">
    <div class="gameCreation">
      <div class="balanceContainer"></div>
      <div class="icreaseContainer"></div>
      <div class="gameSizeContainer"></div>
    </div>
    <div v-for="game in gameList" class="gameContainer">
      <div class="game">
        <div class="gridContainer">
          <div v-on:click="mineClick($event, game)" v-for="grid in game.grid.size" class="grid" v-bind:id="game.gameIdentifier + grid"></div>
        </div>
      </div>
      <div class="infoContainer">
        <div class="nextRewardContainer"></div>
        <div class="totalStakeContainer"></div>
        <div class="cashOutContainer"></div>
        <div class="userLogContainer"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'minesweeperCards',
  methods: {
    mineClick: function (event, game) {
      if (game.gameState == "Cash Out") {
        for (let bombCheckLoop = 0; bombCheckLoop < game.bombLocation.length; bombCheckLoop++) {
          if ((event.currentTarget.id).toString() == (game.gameIdentifier+game.bombLocation[bombCheckLoop]).toString()) {
            document.getElementById(game.gameIdentifier+game.bombLocation[0]).style.background = "#FA5252";
            document.getElementById(game.gameIdentifier+game.bombLocation[1]).style.background = "#FA5252";
            document.getElementById(game.gameIdentifier+game.bombLocation[2]).style.background = "#FA5252";
            game.gameState = "Defeat!"
            return;
          }
        }
        document.getElementById(event.currentTarget.id).style.background = "#40C057";
        this.boardStateCheck(game);
        return;
      }
      return;
    },
    boardStateCheck: function (game) {
      let clearedCount = 0;
      for (let gridFinishedLoop = 1; gridFinishedLoop < game.grid.size+1; gridFinishedLoop++) {
        if (document.getElementById(game.gameIdentifier+gridFinishedLoop.toString()).style.background.includes("rgb(64, 192, 87)")) {
          clearedCount++;
        }
      }
      if (clearedCount == 25-game.numberOfBombs) {
        game.gameState = "Cashed Out";
        console.log("user has won");
        return;
      }
      return;
    }
  },
  data() {
    return {
      gameList: [
        {
          gameIdentifier: "a",
          grid: {size: 25},
          numberOfBombs: 3,
          bombLocation: [17,9,24],
          nextReward: 354,
          totalStake: 7537,
          gameState: "Cash Out",
          gameLog: []
        }
        // ,
        // {
        //   gameIdentifier: "b",
        //   grid: {size: 25},
        //   numberOfBombs: 3,
        //   bombLocation: [5,10,20],
        //   nextReward: 354,
        //   totalStake: 7537,
        //   gameState: "Cash Out",
        //   gameLog: []
        // }
        // {
        //   grid: {size: 25},
        //   numberOfBombs: 3,
        //   bombLocation: [
        //     {x: 2,y: 4},
        //     {x: 4,y: 2},
        //     {x: 5,y: 4}
        //   ],
        //   nextReward: 354,
        //   totalStake: 7537,
        //   gameState: "defeat",
        //   gameLog: []
        // }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .main {
    width: 80vw;
    float: right;
    height: 100vw;
    //height: auto;
  }

  .gridContainer {
    width: 375px;
    height: 375px;
    display: grid;
    grid-template-columns: repeat(5, auto);
    grid-template-rows: repeat(5, auto);
    grid-gap: 10px 10px;
  }

  .grid {
    width: 75px;
    height: 75px;
    background-color: #CED4DA;
  }
</style>
