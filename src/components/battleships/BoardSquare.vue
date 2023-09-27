<script lang="ts" setup>
import MineBombTile from '../minesweeper/MineBombTile.vue'
import { computed, ref } from 'vue'

// userid = 1 = 'you'
// userid = 2 = 'opponent'
const props = withDefaults(
  defineProps<{
    flip?: boolean
    game?: any
    id: number
    displayIcon?: boolean
    userid: 1 | 2
    hasBoat?: boolean
  }>(),
  {
    displayIcon: true,
    game: undefined,
    hasBoat: false
  }
)

const emit = defineEmits<{
  (e: 'squareClick', id: number): void
}>()

const hover = ref(false)

const handleClick = () => {
  if (props.flip) return
  emit('squareClick', props.id)
}

const fipCardStyle = computed(() => {
  return props.flip || props.userid === 1 ? 'transition: all 1s;transform: rotateY(180deg);' : ''
})
</script>

<template>
  <div
    class="card"
    ref="card"
    @click="handleClick"
    :style="fipCardStyle"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :class="{ hover: !(flip || userid === 1) && hover, boat: hasBoat }"
  >
    <div class="front"></div>
    <div class="back">
      <MineBombTile v-if="hasBoat && flip" :display-icon="displayIcon" />
      <div class="plain" v-else>
        <div class="circle" v-if="userid === 1 && flip"></div>
      </div>
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

.boat {
  .plain {
    background: var(--color-hightlight-green) !important;
  }
}

.glow {
  box-shadow: var(--color-hightlight-green) 0px 4px 12px;
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

.plain {
  background: var(--color-container-subtle);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle {
  background: var(--color-text-subtle);
  /* background: var(--color-container-titles); */
  height: 50%;
  border-radius: 100%;
  width: 50%;
}
</style>
