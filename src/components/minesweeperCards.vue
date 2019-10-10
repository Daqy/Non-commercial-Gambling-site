<template>
  <div class="main">
    <div class="gameCreation">
      <div class="balanceContainer"></div>
      <div class="icreaseContainer"></div>
      <div class="gameSizeContainer">
        <div class="moneyContainer"><p>{{ gameCurrenySet }}</p></div>
        <div class="bombMultiplierContainer">
          <div class=""><h2>x1</h2></div>
          <div class="activeMultiplier"><h2>x3</h2></div>
          <div class=""><h2>x5</h2></div>
          <div class=""><h2>x24</h2></div>
        </div>
        <div class="createGame" v-on:click="createGameClick()"><h2>Play</h2></div>
      </div>
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
    },
    createGameClick: function() {
      let newBombLocation = [];
      for (let i = 0; i < 3; i++) {
        newBombLocation.push(this.getRandomInt(25, newBombLocation)+1);
      }
      this.gameList.push({
        gameIdentifier: '_' + Math.random().toString(36).substr(2, 9),
        grid: {size: 25},
        numberOfBombs: parseInt(document.getElementsByClassName("activeMultiplier")[0].textContent.split("x")[1]),
        bombLocation: [newBombLocation[0], newBombLocation[1], newBombLocation[2]],
        nextReward: 354,
        totalStake: 7537,
        gameState: "Cash Out",
        gameLog: []
      });
    },
    getRandomInt: function(max, bombLocation) {
      if (bombLocation.length == 0) {
        return Math.floor(Math.random() * Math.floor(max));
      }
      let rdnNum = Math.floor(Math.random() * Math.floor(max));
      for (let existingNumLoop = 0; existingNumLoop < bombLocation.length; existingNumLoop++) {
        if (bombLocation[existingNumLoop] == rdnNum) {
          return getRandomInt(max, bombLocation);
        }
      }
      return Math.floor(Math.random() * Math.floor(max));
    }
  },
  data() {
    return {
      gameCurrenySet: 8000,
      gameList: []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .main {
    width: 80vw;
    float: right;
    //height: 100vw;
    height: auto;
  }

  .gridContainer {
    width: 375px;
    height: 375px;
    display: grid;
    grid-template-columns: repeat(5, auto);
    grid-template-rows: repeat(5, auto);
    grid-gap: 10px 10px;
  }

  .gameCreation {
    height: 200px;
    width: 972px;
    display: inline-grid;
    grid-template-columns: repeat(3, 264px);
    grid-template-rows: repeat(3, 198px);
    grid-gap: 30px 30px;
    justify-content: center;

    div {
      background-color: #2D3237;
    }

    .gameSizeContainer {
      text-alignt: center;
      display: grid;
      color: white;
      grid-template-columns: repeat(1, 100%);
      grid-template-rows: repeat(3, 33.33%);
      grid-gap: 0px 0px;

      .bombMultiplierContainer {
        display: grid;
        grid-template-columns: repeat(4, 25%);
        grid-template-rows: repeat(1, 100%);
        grid-gap: 0px 0px;

        div {
          background-color: #ADB5BD;
        }
        .activeMultiplier {
          background-color: #0068D1;
        }
      }

      .createGame {
        background-color: #005EBD;
      }

      div {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      div h2 {
        text-align: center;
      }
    }
  }

  .grid {
    width: 75px;
    height: 75px;
    background-color: #CED4DA;
  }
</style>
