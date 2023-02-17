<script lang="ts" setup>
import SweeperTile from "./tiles/SweeperTile.vue";
import BombTile from "./tiles/BombTile.vue";
import ClearTile from "./tiles/ClearTile.vue";
import { computed, shallowRef, ref, inject, reactive, watch } from "vue";

const _state = inject("states");

const props = defineProps({
  sweeper: {
    type: Object,
    required: true,
  },
  resetGame: {
    type: Boolean,
  },
});

const emit = defineEmits(["cashEarnt", "resetComplete"]);

const gridSizeX = ref(props.sweeper.size.x);
const gridSizeY = ref(props.sweeper.size.y);

const gridPositionClicked = shallowRef({});
const earningsPerClick = ref({});

const gridSize = computed(() => {
  return gridSizeX.value * gridSizeY.value;
});

function truncate(value: number) {
  if (value.toString().includes("."))
    return Number(value.toString().slice(0, value.toString().indexOf(".") + 3));
  return value;
}

const percentageOfWinning = computed(() => {
  let total = 1;
  for (
    let index = 0;
    index < Object.keys(gridPositionClicked.value).length;
    index++
  ) {
    // console.log(
    //   gridSize.value - props.sweeper.mine.length - index
    //   gridSize.value - index
    // );
    total *=
      (gridSize.value - props.sweeper.mine.length - index) /
      (gridSize.value - index);
  }
  return total;
});

const percentageOfWinningNextClick = computed(() => {
  let total = 1;
  for (
    let index = 0;
    index < Object.keys(gridPositionClicked.value).length + 1;
    index++
  ) {
    // console.log(
    //   gridSize.value - props.sweeper.mine.length - index
    //   gridSize.value - index
    // );
    total *=
      (gridSize.value - props.sweeper.mine.length - index) /
      (gridSize.value - index);
  }
  return total;
});

const previousStakeTotal = ref(0);
const totalEarned = ref(0);
// GET MULTIPLER, CALUCLATE TOTAL, RECORD PREVIOUS RESULTS REMOVE THAT FROM TOTAL WHICH IS EACH CLICK

function calculateButtonPressMoney() {
  if (Object.keys(gridPositionClicked.value).length == 1) {
    previousStakeTotal.value +=
      (1 / percentageOfWinning.value) * props.sweeper.stake -
      props.sweeper.stake;
    return truncate(
      (1 / percentageOfWinning.value) * props.sweeper.stake -
        props.sweeper.stake
    );
  }

  let calculateValue =
    (1 / percentageOfWinning.value) * props.sweeper.stake -
    props.sweeper.stake -
    previousStakeTotal.value;

  previousStakeTotal.value =
    (1 / percentageOfWinning.value) * props.sweeper.stake - props.sweeper.stake;
  return truncate(calculateValue);
  // previousStakeTotal.value += totalNewStake;
}

function calculateDelay(
  totalNumber: number,
  numberOfMine: number = totalNumber
) {
  return Math.pow((1 / totalNumber) * numberOfMine, 0.5) * 300;
}

watch(
  () => props.resetGame,
  (reset: boolean) => {
    if (reset) {
      previousStakeTotal.value = 0;
      totalEarned.value = 0;
      earningsPerClick.value = {};
      gridPositionClicked.value = {};
    }
  }
);

watch(
  () => props.sweeper.gameState,
  (newState) => {
    if (newState == _state.CLAIMED)
      for (let mine of props.sweeper.mine) {
        let temp = {};
        temp[mine] = BombTile;
        gridPositionClicked.value = {
          ...gridPositionClicked.value,
          ...temp,
        };
      }
    if (newState == _state.ONGOING) {
      emit("resetComplete");
      emit("cashEarnt", {
        total: (1 / percentageOfWinning.value) * props.sweeper.stake,
        nextClick:
          (1 / percentageOfWinningNextClick.value) * props.sweeper.stake -
          (1 / percentageOfWinning.value) * props.sweeper.stake,
      });
    }
  }
);

watch(
  () => props.sweeper.mine,
  (mine) => {
    loopForBombCount.value = mine.length;
    delay.value = calculateDelay(mine.length);
  }
);

const loopForBombCount = ref(props.sweeper.mine.length);
const delay = ref(calculateDelay(props.sweeper.mine.length));

function showBombWithDelay(sweeper: number[]) {
  const tempTimeout = setTimeout(() => {
    delay.value = calculateDelay(sweeper.length, loopForBombCount.value);
    const currentShowBombIndex =
      sweeper[sweeper.length - loopForBombCount.value];
    let temp = {};
    temp[currentShowBombIndex] = BombTile;
    gridPositionClicked.value = {
      ...gridPositionClicked.value,
      ...temp,
    };
    if (props.sweeper.gameState == _state.ONGOING) {
      clearTimeout(tempTimeout);
      return;
    }
    if (loopForBombCount.value > 0) {
      loopForBombCount.value--;
      showBombWithDelay(sweeper);
    }
  }, delay.value);
}

function isTileBomb(bombIndex: number) {
  return props.sweeper.mine.includes(bombIndex);
}

function noMoreClearTiles() {
  return (
    Object.keys(gridPositionClicked.value).length ==
    gridSize.value - props.sweeper.mine.length
  );
}

function onCardClick(id: number) {
  if (props.sweeper.gameState != _state.ONGOING) return;
  if (isTileBomb(id)) {
    let temp = {};
    temp[id] = BombTile;
    gridPositionClicked.value = { ...gridPositionClicked.value, ...temp };

    const currentBombClicked = props.sweeper.mine.indexOf(id);
    let sweeperMine = props.sweeper.mine;
    sweeperMine.splice(currentBombClicked, 1);
    showBombWithDelay(sweeperMine);

    props.sweeper.gameState = _state.LOST;
  } else if (gridPositionClicked.value[id] == undefined) {
    let temp = {};
    temp[id] = ClearTile;
    gridPositionClicked.value = { ...gridPositionClicked.value, ...temp };
    totalEarned.value = (1 / percentageOfWinning.value) * props.sweeper.stake;
    temp = {};
    temp[id] = calculateButtonPressMoney();
    earningsPerClick.value = {
      ...earningsPerClick.value,
      ...temp,
    };
    let tempClick =
      (1 / percentageOfWinningNextClick.value) * props.sweeper.stake -
      totalEarned.value;

    if (noMoreClearTiles()) {
      props.sweeper.gameState = _state.CLAIMED;
      for (let mine of props.sweeper.mine) {
        let temp = {};
        temp[mine] = BombTile;
        gridPositionClicked.value = {
          ...gridPositionClicked.value,
          ...temp,
        };
      }
      tempClick = earningsPerClick.value[id];
    }
    emit("cashEarnt", {
      total: totalEarned.value,
      nextClick: tempClick,
    });
  }
}
// emit("cashEarnt", {
//   total: (1 / percentageOfWinning.value) * props.sweeper.stake,
//   nextClick:
//     (1 / percentageOfWinningNextClick.value) * props.sweeper.stake -
//     (1 / percentageOfWinning.value) * props.sweeper.stake,
// });
</script>

<template>
  <div class="sweeperGrid">
    <SweeperTile
      v-for="card in gridSize"
      :key="card"
      :state="sweeper.gameState"
      :isBomb="gridPositionClicked[card] == BombTile"
      :autoFlip="
        sweeper.gameState == _state.LOST &&
        sweeper.mine.includes(card) &&
        gridPositionClicked[card] != undefined
      "
      :reset="resetGame"
      @click="onCardClick(card)"
    >
      <component
        :is="gridPositionClicked[card]"
        v-bind="{
          state: sweeper.gameState,
          earn: earningsPerClick[card],
        }"
      />
    </SweeperTile>
  </div>
</template>

<style lang="scss" scoped>
$gridX: v-bind(gridSizeX);
$gridY: v-bind(gridSizeY);

.sweeperGrid {
  height: 80%;
  aspect-ratio: 1/1;
  display: grid;
  grid-template: repeat($gridX, 1fr) / repeat($gridY, 1fr);
  grid-gap: 10px;
}
</style>
