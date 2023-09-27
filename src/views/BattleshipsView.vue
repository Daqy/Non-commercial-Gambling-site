<script lang="ts" setup>
import { useApi } from '@/services/api'
const latestGame = useApi('/api/latest-game?gameType=battleships')

latestGame.get().catch((error) => {})
</script>

<template>
  <main class="game">
    <section class="player-games"></section>
    <section class="create-game"></section>
  </main>
</template>

<style lang="scss" scoped>
main {
  flex-grow: 1;
  display: flex;
}

.player-games {
  height: 100%;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;

  &::after {
    content: '';
    position: absolute;
    right: 0px;
    width: 2px;
    height: 90%;
    background: var(--color-container-titles);
  }
}

.create-game {
  height: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
