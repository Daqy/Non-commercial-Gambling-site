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
const clicked = ref([])

const squareClick = (id: number) => {
  clicked.value.push(id)
}

const grid = ref<HTMLDivElement>()
const fleet = ref<HTMLDivElement>()

const fleetPosition = computed(() => {
  return fleet.value?.getBoundingClientRect()
})

const botPositions = ref<number[]>([])
const shipOnGrid = ref({})
const hiddenShips = ref([])

const placeOnGrid = (data) => {
  const boatPositions = createArray(
    botPositions.value[0],
    botPositions.value[0] + data.id,
    data.rotation === 'horizontal' ? 1 : 8
  )
  let filtered = []
  Object.keys(shipOnGrid.value).forEach((value) => {
    if (value !== data.id) {
      const ship = shipOnGrid.value[value]
      filtered = ship.filter((key) => boatPositions.includes(key))
    }
  })
  if (filtered.length > 0) {
    return
  }

  shipOnGrid.value[data.id] = boatPositions
  if (!hiddenShips.value.includes(data.id)) {
    hiddenShips.value.push(data.id)
  }
  boatInGridElement.value = { id: data.id, pos: pos.value }
  // updatePosition({ id: data.id, pos: { x: 0, y: 0 } })
}

const hasBoat = (index) => {
  let returnValue = false
  Object.keys(shipOnGrid.value).forEach((ship) => {
    if (shipOnGrid.value[ship].includes(index)) {
      returnValue = true
    }
  })
  return returnValue
}

const handleClick = (id) => {
  console.log(hiddenShips.value)
  if (hiddenShips.value?.includes(id)) {
    // shipOnGrid.value = {}
    hiddenShips.value = []
  }
}

const createArray = (start: number, stop: number, step = 1) => {
  return Array.from({ length: stop - start }, (value, index) => start + index * step)
}

const boatInGridElement = ref()
const pos = ref()

const handlePosition = (ship) => {
  const children = Array.from(grid.value?.children[1].children ?? [])
  let hasChanged = false
  if (ship.reset && hiddenShips.value.includes(ship.id)) {
    hiddenShips.value.splice(
      hiddenShips.value.findIndex((value) => value === ship.id),
      1
    )
    shipOnGrid.value[ship.id] = []
  }
  children.forEach((child, index) => {
    const position = child.getBoundingClientRect()
    const gapSpace = 4
    if (
      ship.pos.x > position.x - gapSpace &&
      ship.pos.x < position.x + position.width + gapSpace &&
      ship.pos.y > position.y - gapSpace &&
      ship.pos.y < position.y + position.height + gapSpace
    ) {
      // console.log(index)
      hasChanged = true
      pos.value = position
      if (ship.rotation === 'horizontal') {
        botPositions.value = createArray(index + 1, index + ship.id + 1, 1)
        const minDiv = Math.floor(botPositions.value[0] / 8)
        const maxDiv = Math.floor((botPositions.value[botPositions.value.length - 1] - 1) / 8)
        if (minDiv !== maxDiv) {
          botPositions.value = []
        }
      } else {
        botPositions.value = createArray(index + 1, index + ship.id + 1, 8)

        const maxDiv = Math.floor((botPositions.value[botPositions.value.length - 1] - 1) / 8)
        if (maxDiv > 8) {
          botPositions.value = []
        }
      }
    }
  })
  if (!hasChanged) {
    botPositions.value = []
  }
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
          v-for="index in 64"
          :key="index"
          :id="index"
          :shipHit="false"
          :flip="false"
          :hasBoat="hasBoat(index)"
          :userid="1"
          @square-click="handleClick"
          :class="{
            glow: botPositions.includes(index) && !hasBoat(index)
          }"
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
          :flip="clicked.includes(index)"
          :userid="2"
          @square-click="squareClick"
        />
      </MineGameBoard>
    </section>

    <section ref="fleet" class="fleet"></section>
    <div class="ships">
      <template v-if="fleetPosition">
        <BattleshipShip
          :id="5"
          :initial-position="{ x: fleetPosition.x, y: fleetPosition.y }"
          :grid="grid"
          :has-been-placed="hiddenShips.includes(5)"
          :update-position="boatInGridElement"
          @position="handlePosition"
          @place-on-grid="placeOnGrid"
        />
        <BattleshipShip
          :id="4"
          :initial-position="{ x: fleetPosition.x + 300, y: fleetPosition.y }"
          :grid="grid"
          :has-been-placed="hiddenShips.includes(4)"
          :update-position="boatInGridElement"
          @position="handlePosition"
          @place-on-grid="placeOnGrid"
        />
      </template>

      <!-- <div ref="five" class="five ship" :style="style" style="position: fixed">{{ x }}{{ y }}</div> -->
    </div>
  </main>
</template>

<style lang="scss" scoped>
.game {
  position: relative;
  display: flex;
  flex-grow: 1;

  & > section:not(.fleet) {
    /* width: 50%; */
    padding: 40px;
    height: calc(100% - 22px);
    aspect-ratio: 1/1;
  }
}

.fleet {
  position: absolute;
  width: 80%;
  height: 100px;
  background: var(--color-container-titles);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  bottom: -78px;
  border-radius: 10px;
  left: 50%;
  transform: translate(-50%, 0);
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
    /* gap: 0 20px; */

    span {
      display: flex;
      justify-content: center;
      width: calc(calc(428px - calc(0.5rem * 8)) / 8);
    }
  }

  .numbers {
    position: absolute;
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
