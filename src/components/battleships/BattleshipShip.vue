<script lang="ts" setup>
import { useDraggable } from '@vueuse/core'
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  id: number
  position: { x: number; y: number }
  hasBeenPlaced: boolean
}>()

const emit = defineEmits<{
  (
    e: 'position',
    pos: { id: number; position: { x: number; y: number }; isHorizontal: boolean }
  ): void
  (e: 'functions', fn: { id: number; reset: any; reposition: any }): void
  (e: 'release', id: number): void
}>()

const shipRef = ref<HTMLDivElement>()

const grid = { size: 45.5, gap: 8 }
const isHorizontal = ref(true)

const {
  x,
  y,
  style: positionStyles,
  isDragging
} = useDraggable(shipRef, {
  initialValue: { x: props.position.x, y: props.position.y }
})

const reset = () => {
  x.value = props.position.x
  y.value = props.position.y
  isHorizontal.value = true
}

const handleRotation = (event: KeyboardEvent) => {
  if (isDragging.value && (event.key === 'r' || event.key === 'R')) {
    isHorizontal.value = !isHorizontal.value
    emitPosition()
  }
}

const sizeStyleVar = computed(() => {
  if (isHorizontal.value) {
    return `height: ${grid.size}px; width: ${grid.size * props.id + grid.gap * (props.id - 1)}px`
  }
  return `height: ${grid.size * props.id + grid.gap * (props.id - 1)}px; width: ${
    grid.size
  }px; flex-direction: column;`
})

const shipDragStyle = computed(() => {
  return isDragging.value ? 'opacity: 0.3' : props.hasBeenPlaced ? 'opacity: 0' : 'opacity: 1'
})

const emitPosition = () => {
  emit('position', {
    id: props.id,
    position: { x: x.value, y: y.value },
    isHorizontal: isHorizontal.value
  })
}

const reposition = ({ x: _x, y: _y }: { x: number; y: number }) => {
  x.value = _x
  y.value = _y
}

const posStyle = computed(() => {
  return isDragging.value || props.hasBeenPlaced ? positionStyles.value + 'position: fixed' : ''
})

watch(
  () => [x.value, y.value],
  () => {
    emitPosition()
  }
)

watch(
  () => isDragging.value,
  () => {
    if (!isDragging.value) {
      emit('release', props.id)
    }
  }
)

emit('functions', { id: props.id, reset, reposition })
</script>

<template>
  <div
    tabindex="0"
    ref="shipRef"
    class="ship"
    :style="[posStyle, shipDragStyle, sizeStyleVar]"
    :class="{ dragging: isDragging }"
    @keyup="handleRotation"
  >
    <span v-for="box in id" :key="box"></span>
    <!-- {{ x }}, {{ y }} -->
  </div>
</template>

<style lang="scss" scoped>
.ship {
  z-index: 10;
  border-radius: 5px;

  /* position: fixed; */
  display: flex;
  gap: 0.5rem;

  &:hover {
    cursor: pointer;
  }

  span {
    /* background: var(--color-card-main); */
    /* background: var(--color-hightlight-darker-green); */
    background: var(--color-hightlight-green);
    aspect-ratio: 1/1;
    border-radius: 5px;
    height: 100%;
  }
}

.dragging {
  z-index: 11;
}
</style>
