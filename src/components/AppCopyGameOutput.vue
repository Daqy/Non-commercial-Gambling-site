<script lang="ts" setup>
import { useGameStore } from '~stores/useGameStore'
import { useAuthStore } from '~stores/useAuthStore'
import { prettify } from '~services/prettify'
import { hasBeenClicked } from '~services/hasBeenClicked'
import { Icons } from '~components/icons'
import { ref } from 'vue'

const authStore = useAuthStore()
const gameStore = useGameStore()

const copied = ref(false)

function copy() {
  if (gameStore.game?.state !== 'done') return

  let copyString = `${authStore.username} has ${
    gameStore.game?.result === 'lost' ? 'lost' : 'claimed'
  }: $${prettify(gameStore.game?.pool)}\n`
  let bombTileEmoji = gameStore.game?.result === 'lost' ? Icons.copy.bomb.lost : Icons.copy.bomb.won
  for (let index = 1; index <= gameStore.game?.size; index++) {
    copyString += gameStore.game?.bomb.position.includes(index)
      ? bombTileEmoji
      : hasBeenClicked(index, gameStore.game.clicks)
      ? Icons.copy.click
      : Icons.copy.default
    if (index % 5 === 0) {
      copyString += '\n'
    }
  }
  copyString += '\nVisit https://daqy.dev/minesweeper to play'
  navigator.clipboard.writeText(copyString)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1000)
}
</script>

<template>
  <span @click="copy">
    <component :class="{ copied: copied }" :is="copied ? Icons.copy.copied : Icons.copy.icon" />
    <span class="tooltip" v-if="copied">
      <span>copied</span>
    </span>
  </span>
</template>

<style lang="scss" scoped>
.tooltip {
  box-sizing: content-box;
  z-index: 10;
  position: absolute;
  left: 30px;
  top: -5px;
  background: black;
  color: white;
  padding: 5px 10px;
  height: fit-content;
  border-radius: 5px;
  width: auto;
  display: flex;
  align-items: center;

  span {
    width: fit-content;
    box-sizing: content-box;
  }

  &:before {
    content: '';
    position: absolute;
    background: black;
    left: -3px;
    width: 1rem;
    height: 1rem;
    transform: rotate(45deg);
  }
}
span:not(.tooltip):not(.tooltip span) {
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 5px;

  &:hover {
    cursor: pointer;
  }

  svg {
    height: 100%;
    widows: 100%;
    fill: var(--color-text-subtle);

    &:not(.copied):hover {
      fill: var(--color-container-titles);
    }
  }
  /* .copied {
    fill: var(--color-hightlight-green);
  } */
}
</style>
