<script lang="ts" setup>
import { onUnmounted, computed, ref, inject } from 'vue'
import MineGameBoard from '~components/minesweeper/MineGameBoard.vue'
import BoardSquare from '~components/battleships/BoardSquare.vue'
import BattleshipShip from '~components/battleships/BattleshipShip.vue'

document.documentElement.style.setProperty('--margin-bottom-main-container', '50px')

onUnmounted(() => {
  document.documentElement.style.setProperty('--margin-bottom-main-container', '0px')
})

const gridRowCount = 8
const alphabet = 'abcdefghijklmnopqrstuvwxyz'

const lettersOnGrid = computed(() => {
  return alphabet.slice(0, gridRowCount).split('')
})

const grid = ref<HTMLDivElement>()
const fleet = ref<HTMLDivElement>()

const fleetPosition = computed(() => {
  return fleet.value?.getBoundingClientRect()
})

const createArray = (start: number, stop: number, step = 1) => {
  return Array.from({ length: stop - start }, (value, index) => start + index * step)
}

const shipFunctions = ref<{ [id: number]: any }>({})
const isHovering = ref<number[]>([])
const onGrid = ref<{ [id: number]: number[] }>({})

const getFunctionCalls = (data: { id: number; [fn: string]: any }) => {
  const { id, ...fn } = data
  shipFunctions.value[id] = fn
}

const placeOnGrid = (id: number) => {
  if (isHovering.value.length === 0) {
    delete onGrid.value[id]
    shipFunctions.value[id].reset()
    return
  }

  onGrid.value[id] = isHovering.value
  isHovering.value = []

  const gridBox = grid.value?.children[1].children[onGrid.value[id][0] - 1].getBoundingClientRect()
  shipFunctions.value[id].reposition({ x: gridBox?.x, y: gridBox?.y })
}

const shipOnGrid = (gridNumber: number) => {
  if (!onGrid.value) {
    return false
  }
  const keys = Object.keys(onGrid.value)
  for (const key of keys) {
    if (onGrid.value[Number(key)].includes(gridNumber)) {
      return true
    }
  }
  return false
}

const handleShipPositionUpdate = ({ id, position, isHorizontal }) => {
  if (!grid.value) {
    return
  }

  const gridPositions = grid.value.getBoundingClientRect()
  const padding = Number(window.getComputedStyle(grid.value).padding.replace(/\D+/g, ''))

  //check if ship is on the grid, if it isn't return
  if (
    !(
      position.x > gridPositions.x + padding &&
      gridPositions.x + gridPositions.width - padding > position.x &&
      position.y > gridPositions.y + padding &&
      gridPositions.y + gridPositions.height - padding > position.y
    )
  ) {
    isHovering.value = []

    return
  }
  // const gridSize = { size: 45, gap: 8 }
  const children = Array.from(grid.value?.children[1].children ?? [])

  children.forEach((gridBox, gridNumber) => {
    const gridBoxPosition = gridBox.getBoundingClientRect()
    // check if topleft of ship is in the box
    if (
      !(
        position.x > gridBoxPosition.x &&
        gridBoxPosition.x + gridBoxPosition.width > position.x &&
        position.y > gridBoxPosition.y &&
        gridBoxPosition.y + gridBoxPosition.height > position.y
      )
    ) {
      return
    }
    const hoverPosition = createArray(gridNumber + 1, gridNumber + 1 + id, isHorizontal ? 1 : 8)

    //check if the hover position is being placed onto a new line, if it prevent it.
    if (
      (isHorizontal &&
        Math.floor((hoverPosition[0] - 1) / 8) !==
          Math.floor((hoverPosition[hoverPosition.length - 1] - 1) / 8)) ||
      (!isHorizontal && Math.floor(hoverPosition[hoverPosition.length - 1]) / 8 > 8)
    ) {
      isHovering.value = []
      return
    }
    // check if ship is hovering another ship
    for (const pos of hoverPosition) {
      const keys = Object.keys(onGrid.value)

      for (const key of keys) {
        if (onGrid.value[Number(key)].includes(pos) && Number(key) !== id) {
          isHovering.value = []
          return
        }
      }
    }

    isHovering.value = hoverPosition
  })
}
</script>

<template>
  <main class="game">
    <section class="player" ref="grid">
      <div class="gridCords">
        <div class="letters">
          <span v-for="(char, index) in lettersOnGrid" :key="index">{{ char }}</span>
        </div>
        <div class="numbers">
          <span v-for="number in gridRowCount" :key="number">{{ number }}</span>
        </div>
      </div>

      <!-- {{ botPositions }} {{ shipOnGrid }} -->
      <MineGameBoard :loading="false" :perRow="gridRowCount">
        <BoardSquare
          v-for="gridNumber in 64"
          :key="gridNumber"
          :id="gridNumber"
          :shipHit="false"
          :flip="false"
          :hasBoat="shipOnGrid(gridNumber)"
          :userid="1"
          :class="{ glow: isHovering.includes(gridNumber) }"
        />
      </MineGameBoard>
    </section>

    <section class="opponent">
      <div class="gridCords">
        <div class="letters">
          <span v-for="(char, index) in lettersOnGrid" :key="index">{{ char }}</span>
        </div>
        <div class="num-right numbers">
          <span v-for="number in gridRowCount" :key="number">{{ number }}</span>
        </div>
      </div>
      <MineGameBoard :loading="false" :perRow="gridRowCount">
        <BoardSquare
          v-for="index in 64"
          :key="index"
          :id="index"
          :hasBoat="false"
          :shipHit="true"
          :flip="false"
          :userid="2"
        />
      </MineGameBoard>
    </section>

    <section ref="fleet" class="fleet"></section>
    <div
      v-if="fleetPosition"
      class="ships"
      :style="`top: ${fleetPosition.y}px;left: ${fleetPosition.x}px;width: ${fleetPosition.width}px`"
    >
      <BattleshipShip
        v-for="(ship, index) in [5, 4, 3, 2, 1]"
        :key="ship"
        :id="ship"
        :position="{
          x: fleetPosition.x + 10 + (300 - 30 * (index - 1)) * index,
          y: fleetPosition.y + 10
        }"
        :has-been-placed="!!onGrid[ship]"
        @functions="getFunctionCalls"
        @position="handleShipPositionUpdate"
        @release="placeOnGrid"
      />
      <div class="button-container">
        <button v-if="Object.keys(onGrid).length === 5" class="button">
          Confirm Ship Placement
        </button>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.game {
  position: relative;
  display: flex;
  flex-grow: 1;

  & > section:not(.fleet) {
    user-select: none;

    /* width: 50%; */
    padding: 40px;
    height: calc(100% - 22px);
    aspect-ratio: 1/1;
  }
}

.ships {
  position: fixed;
  display: flex;
  /* justify-content: space-between; */
  gap: 1.85rem;
  padding: 10px;
  /* justify-items: space-between; */
  /* justify-items: */
}

.fleet {
  position: absolute;
  width: 90%;
  height: 65.5px;
  background: var(--color-container-titles);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  bottom: -44px;
  border-radius: 10px;
  left: 50%;
  transform: translate(-50%, 0);
}

.button-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button {
  text-transform: capitalize;
}

.button:not(:disabled) {
  background: var(--color-container-subtle);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  border: 2px solid var(--color-create-game-button);
  border-radius: 5px;
  min-height: 45.5px;
  padding: 10px 20px;
  /* aspect-ratio: 4/1; */
  font-size: 1em;
  font-weight: bold;
  color: var(--color-create-game-button);

  &:hover {
    cursor: pointer;
    background: var(--color-create-game-button);
    color: var(--color-create-game-button-text);
  }
}

.gridCords {
  position: absolute;
  top: 0px;
  left: 0px;
  color: var(--color-text-subtle);
  .letters {
    position: absolute;
    top: 20px;
    left: 40px;
    transform: translate(0, -50%);
    text-transform: uppercase;
    display: flex;
    gap: 0.5rem;
    user-select: none;

    /* gap: 0 20px; */

    span {
      display: flex;
      justify-content: center;
      width: calc(calc(428px - calc(0.5rem * 8)) / 8);
    }
  }

  .numbers {
    position: absolute;
    user-select: none;
    top: 40px;
    left: 20px;
    transform: translate(-50%, 0);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    /* gap: 0 20px; */

    span {
      display: flex;
      align-items: center;
      height: calc(calc(428px - calc(0.5rem * 8)) / 8);
    }
  }
}

.num-right {
  left: 480px;
}

.player {
  position: relative;
  /* background: blue; */
  &::after {
    content: '';
    position: absolute;
    top: 5%;
    right: 0px;
    width: 2px;
    height: 90%;
    background: var(--color-container-titles);
  }
}
.opponent {
  /* background: red; */
}
</style>
