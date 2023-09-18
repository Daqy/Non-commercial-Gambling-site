<script lang="ts" setup>
import { onUnmounted, computed, ref } from 'vue'
import MineGameBoard from '~components/minesweeper/MineGameBoard.vue'
import BoardSquare from '~components/battleships/BoardSquare.vue'

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
</script>

<template>
  <main class="game">
    <section class="player">
      <div class="gridCords">
        <div class="letters">
          <span v-for="(char, index) in lettersOnGrid" :key="index">{{ char }}</span>
        </div>
        <div class="numbers">
          <span v-for="number in gridRowCount" :key="number">{{ number }}</span>
        </div>
      </div>
      <MineGameBoard :loading="false" :perRow="gridRowCount">
        <BoardSquare
          v-for="index in 64"
          :key="index"
          :id="index"
          :shipHit="false"
          :flip="false"
          :userid="1"
        />
      </MineGameBoard>
    </section>
    <section class="opponent">
      <div class="gridCords">
        <div class="letters">
          <span v-for="(char, index) in lettersOnGrid" :key="index">{{ char }}</span>
        </div>
        <div class="numbers">
          <span v-for="number in gridRowCount" :key="number">{{ number }}</span>
        </div>
      </div>
      <MineGameBoard :loading="false" :perRow="gridRowCount">
        <BoardSquare
          v-for="index in 64"
          :key="index"
          :id="index"
          :shipHit="true"
          :flip="clicked.includes(index)"
          :userid="2"
          @square-click="squareClick"
        />
      </MineGameBoard>
    </section>
    <section class="fleet"></section>
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
