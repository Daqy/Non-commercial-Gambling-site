<script lang="ts" setup>
import { useGameStore } from '~stores/useGameStore'
import { Icons } from '~components/icons'

const gameStore = useGameStore()

defineProps<{
  displayIcon: boolean
}>()
</script>

<template>
  <div class="bomb-container">
    <component :is="Icons.minesweeper" v-if="displayIcon" />
  </div>
</template>

<style lang="scss" scoped>
.winner {
  background: var(--color-bomb-background-winners) !important;
  &::after {
    content: '';
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.4;
    position: absolute;
  }
}
.bomb-container {
  height: 100%;
  width: 100%;
  background: var(--color-bomb-background);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: shake 0.5s 2;

  svg {
    width: 57%;
  }
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>
