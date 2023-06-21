<script lang="ts" setup>
import MineBombTile from './MineBombTile.vue'
import MineCashTile from './MineCashTile.vue'
import { ref, computed } from 'vue'
import { useGameStore } from '~stores/useGameStore'

const gameStore = useGameStore()

const card = ref(null)
const hover = ref(false)

const props = defineProps<{
  earn: number
  flip?: boolean
  isBomb?: boolean
  id: number
}>()

const emit = defineEmits<{
  (e: 'squareClick', id: number): void
}>()

const fipCardStyle = computed(() => {
  return props.flip || props.isBomb ? 'transition: all 1s;transform: rotateY(180deg);' : ''
})
</script>

<template>
  <div
    class="card"
    ref="card"
    @click="emit('squareClick', props.id)"
    :style="fipCardStyle"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :class="{ hover: !(props.flip || isBomb) && hover && gameStore.game?.state === 'ongoing' }"
  >
    <div class="front"></div>
    <div class="back">
      <MineBombTile v-if="isBomb" />
      <MineCashTile :earn="earn" v-else />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  position: relative;
  border-radius: 5px;
  perspective: 1000px;
  transform-style: preserve-3d;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  cursor: default;
}

.hover {
  cursor: pointer;
}

.front,
.back {
  backface-visibility: hidden;
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
}

.back {
  transform: rotateY(180deg);
}
.front {
  background: var(--color-card-main);

  &::before {
    content: '';
    position: absolute;
    width: 150%;
    height: 100%;
    transform: rotate(45deg) translate(-10%, 68%);
    background-color: var(--color-card-highlight);
  }
}
</style>
