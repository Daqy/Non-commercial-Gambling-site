<script lang="ts" setup>
import { Icons } from '~components/icons'
import { useGameStore } from '~stores/useGameStore'
import { prettify } from '@/services/prettify'

const gameStore = useGameStore()
</script>

<template>
  <div class="informatics">
    <div class="information-container" title="Stake in game">
      <div class="svg-container">
        <component
          :is="Icons.coin"
          mainFill="var(--color-text-subtle)"
          secondaryFill="var(--color-container-titles)"
        />
      </div>
      <p>{{ prettify(gameStore.game?.stake) }}</p>
    </div>
    <div class="information-container" title="Bomb Count">
      <div class="svg-container">
        <component :is="Icons.minesweeper" fill="var(--color-text-subtle)" />
      </div>
      <p>{{ gameStore.game?.bomb.count || 0 }}</p>
    </div>
    <div class="information-container" title="Earn per click">
      <div class="svg-container">
        <component :is="Icons.mouseclick" fill="var(--color-text-subtle)" />
      </div>
      <p>{{ prettify(gameStore.game?.nextClick) }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.informatics {
  display: flex;
  width: 80%;
  justify-content: space-around;

  .information-container {
    border-radius: 5px;
    width: 25%;
    height: 96px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    background: var(--color-container-subtle);
  }

  p {
    height: 50%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    color: var(--color-text-subtle);
  }
}

.svg-container {
  width: 100%;
  height: 50%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background: var(--color-container-titles);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px 5px 0px 0px;

  svg {
    height: 75%;
    aspect-ratio: 1/1;
  }
}
</style>
