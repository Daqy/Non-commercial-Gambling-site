<script setup lang="ts">
import MinesweeperGrid from "@/components/minesweeper/MinesweeperGrid.vue";
import BombSVG from "@/components/minesweeper/tile/BombSVG.vue";
import UserBalance from "@/components/UserBalance.vue";
import CreateSweeperGrid from "@/components/minesweeper/CreateSweeperGrid.vue";
</script>

<template>
  <div class="viewContainer">
    <div class="container">
      <div class="gameTitle">
        <div class="svgContainer">
          <BombSVG :fill="'#ffffff'" />
        </div>
        <h2>Minesweeper</h2>
        <UserBalance :balance="10000" />
      </div>
      <div class="sweep-con">
        <div class="minesweeper">
          <MinesweeperGrid />
        </div>
        <div class="createSweeper">
          <CreateSweeperGrid />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.colored-text {
  color: #03ff75;
}
.viewContainer {
  width: 60%;
  min-width: 1000px;
  /* align-self: center; */
}
.container {
  background-color: #1d2839;
  width: 100%;
  aspect-ratio: 3.35/2;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; */
}

.minesweeper {
  height: 100%;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sweep-con {
  display: flex;
  height: 100%;
}

.gameTitle {
  width: 100%;
  height: 75px;
  background-color: #283346;
  display: flex;
  align-items: center;
  padding: 0px 20px;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  /* justify-content: space-between; */

  h2 {
    margin: 0px;
    margin-right: auto;
  }
}

.svgContainer {
  height: 40%;
  aspect-ratio: 1/1;
  margin-right: 10px;
}

.createSweeper {
  height: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
