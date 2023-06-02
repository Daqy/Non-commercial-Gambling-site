<script setup lang="ts">
import MinesweeperGrid from "@/components/minesweeper/MinesweeperGrid.vue";
import CreateSweeperGrid from "@/components/minesweeper/CreateMinesweeperGrid.vue";
import ClaimSweeperRewards from "@/components/minesweeper/ClaimSweeperRewards.vue";
import { reactive } from "@vue/reactivity";
import { inject, ref, onMounted } from "vue";

import { injectStrict } from "@/utils/injectTyped";
import { AxiosKey } from "@/symbols";

const axios = injectStrict(AxiosKey);

const _state = inject("states");

const userid = ref(localStorage.getItem("id"));
const currentGameId = ref(localStorage.getItem("gameid"));

const sweeper = reactive({
  id: 1523123,
  mine: Array.from(Array(0).keys())
    .map((value) => {
      return value + 1;
    })
    .sort((a, b) => 0.5 - Math.random()),
  size: { x: 5, y: 5 },
  gameState: _state.FIRSTGAME,
  stake: 0,
});

onMounted(async () => {
  if (currentGameId != undefined) {
    await axios
      .get(`/api/game/${currentGameId.value}?userid=${userid.value}`)
      .then((res) => {
        sweeper.id = Number(currentGameId.value);
        sweeper.mine = res.data.bomb.location;
        sweeper.gameState = res.data.state;
        sweeper.stake = res.data.stake;
      });
  }
});

const resetGame = ref(false);

async function createGame(gameSettings: {
  betAmount: number;
  multiplier: number;
}) {
  await axios
    .post(
      `api/game?userid=${userid.value}&bombCount=${gameSettings.multiplier}&stake=${gameSettings.betAmount}`
    )
    .then((res) => {
      sweeper.id = Number(res.data.game.id);
      sweeper.mine = res.data.game.bomb.location;
      sweeper.gameState = res.data.game.state;
      sweeper.stake = res.data.game.stake;
      resetGame.value = true;
      localStorage.setItem("gameid", res.data.game.id);
    });
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

async function stateChange() {
  await axios
    .get(`/api/game/${sweeper.id}/getState?userid=${userid.value}`)
    .then((res) => {
      sweeper.gameState = res.data.state;
    });
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
          :gameid="sweeper.id"
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
