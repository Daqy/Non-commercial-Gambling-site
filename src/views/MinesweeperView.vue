<script setup lang="ts">
import MinesweeperGrid from "@/components/minesweeper/MinesweeperGrid.vue";
import CreateSweeperGrid from "@/components/minesweeper/CreateMinesweeperGrid.vue";
import ClaimSweeperRewards from "@/components/minesweeper/ClaimSweeperRewards.vue";
import { reactive } from "@vue/reactivity";
import { inject, ref } from "vue";

const _state = inject("states");

const sweeper = reactive({
  mine: Array.from(Array(0).keys())
    .map((value) => {
      return value + 1;
    })
    .sort((a, b) => 0.5 - Math.random()),
  size: { x: 5, y: 5 },
  gameState: _state.FIRSTGAME,
  stake: 0,
});

const resetGame = ref(false);

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createGame(gameSettings: { betAmount: number; multiplier: number }) {
  const usedValues: number[] = [];
  // while(arr.length < 8){
  //     var r = Math.floor(Math.random() * 100) + 1;
  //     if(arr.indexOf(r) === -1) arr.push(r);
  // }
  sweeper.mine = Array.from(Array(gameSettings.multiplier).keys())
    .map((value: number) => {
      let newValue = randomIntFromInterval(1, 25);
      while (usedValues.indexOf(newValue) != -1) {
        newValue = randomIntFromInterval(1, 25);
      }
      usedValues.push(newValue);
      return newValue;
    })
    .sort((a, b) => 0.5 - Math.random());
  sweeper.gameState = _state.ONGOING;
  sweeper.stake = gameSettings.betAmount;
  resetGame.value = true;
}

const cashEarnt = ref(sweeper.stake);
const nextClick = ref(0);

function onCashEarnt(earnt: { total: number; nextClick: number }) {
  cashEarnt.value = earnt.total;
  nextClick.value = earnt.nextClick;
}

function resetComplete() {
  resetGame.value = false;
}

function stateChange(newState: string) {
  sweeper.gameState = newState;
}
</script>

<template>
  <main>
    <div class="minesweeperContainer">
      <MinesweeperGrid
        :sweeper="sweeper"
        :resetGame="resetGame"
        @cashEarnt="onCashEarnt"
        @resetComplete="resetComplete"
      />
    </div>
    <div class="MinesweeperControlsContaner">
      <div class="controls">
        <CreateSweeperGrid
          :state="sweeper.gameState"
          @createGame="createGame"
        />
        <ClaimSweeperRewards
          :state="sweeper.gameState"
          :cashEarnt="cashEarnt"
          :stake="sweeper.stake"
          :bombCount="sweeper.mine.length"
          :nextClickReward="nextClick"
          @stateChange="stateChange"
        />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  flex-grow: 1;
  width: 100%;
  display: flex;

  > * {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.minesweeperContainer {
  height: 100%;
  aspect-ratio: 1/1;

  &::after {
    content: "";
    height: 90%;
    width: 2px;
    position: absolute;
    background-color: var(--color-container-titles);
    right: -1px;
  }
}

.MinesweeperControlsContaner {
  height: 100%;
  flex-grow: 1;
}

.controls {
  width: 100%;
  height: 80%;
  padding: 0px 10%;
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
