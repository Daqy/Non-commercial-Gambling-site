<script lang="ts" setup>
import { useDraggable } from '@vueuse/core'
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  id: number
  initialPosition: { x: number; y: number }
  grid: HTMLDivElement
  hasBeenPlaced: boolean
  updatePosition: any
}>()

const emit = defineEmits<{
  (
    e: 'position',
    pos: { id: number; pos: { x: number; y: number }; rotation: string; reset?: boolean }
  ): void
  (e: 'placeOnGrid', info: { id: number; rotation: string }): void
}>()

const ship = ref()

// const shipInfo = {
//   width: 225,
//   height: 45
// }
const onGrid = ref(false)

const { x, y, style, isDragging } = useDraggable(ship, {
  initialValue: { x: props.initialPosition.x, y: props.initialPosition.y }
})

const reset = () => {
  ship.value.style.opacity = 1

  if (onGrid.value) {
    emit('placeOnGrid', { id: props.id, rotation: rotation.value })
    return
  }
  x.value = props.initialPosition.x
  y.value = props.initialPosition.y

  emit('position', {
    id: props.id,
    pos: { x: x.value, y: y.value },
    rotation: rotation.value,
    reset: true
  })
}

watch(
  () => props.updatePosition,
  ({ id, pos }) => {
    // console.log(onGrid.value)
    if (props.id === id && onGrid.value) {
      x.value = pos.x
      y.value = pos.y
    }
  }
)

const gridSquareSize = 45.5
const gridGapSize = 8

watch(
  () => [x.value, y.value],
  ([_x, _y]) => {
    onGrid.value = false
    const grid = props.grid?.getBoundingClientRect()
    const padding = Number(window.getComputedStyle(props.grid).padding.replace(/\D+/g, ''))
    if (
      rotation.value === 'horizontal' &&
      _x > grid.x + padding - gridGapSize &&
      _x <
        grid.x +
          grid.width -
          padding -
          (gridGapSize * (props.id - 2) + gridSquareSize * (props.id - 1)) &&
      _y > grid.y + padding - gridGapSize &&
      _y < grid.y + grid.height - padding - gridGapSize
    ) {
      onGrid.value = true
      emit('position', { id: props.id, pos: { x: _x, y: _y }, rotation: rotation.value })
    } else if (
      rotation.value === 'vertical' &&
      _x > grid.x + padding - gridGapSize &&
      _x < grid.x + grid.width - padding + gridGapSize &&
      _y > grid.y + padding - gridGapSize &&
      _y <
        grid.y +
          grid.height -
          padding -
          (gridGapSize * (props.id - 2) + gridSquareSize * (props.id - 1))
    ) {
      onGrid.value = true
      emit('position', { id: props.id, pos: { x: _x, y: _y }, rotation: rotation.value })
    }
  }
)

const handleRotation = (event) => {
  if (isDragging.value && event.key === 'r') {
    rotation.value = rotation.value === 'horizontal' ? 'vertical' : 'horizontal'
  }
}

const rotation = ref('horizontal')

const sizeStyleVar = computed(() => {
  if (rotation.value === 'horizontal') {
    return `height: ${gridSquareSize * 1}px; width: ${
      gridSquareSize * props.id + gridGapSize * (props.id - 1)
    }px`
  }
  return `height: ${gridSquareSize * props.id + gridGapSize * (props.id - 1)}px; width: ${
    gridSquareSize * 1
  }px`
})

const shipDragStyle = computed(() => {
  return isDragging.value
    ? 'opacity: 0.3 !important'
    : props.hasBeenPlaced
    ? 'opacity: 0'
    : 'opacity: 1'
})
</script>

<template>
  <div
    tabindex="0"
    ref="ship"
    class="ship"
    :class="{ hide: hasBeenPlaced }"
    :style="[style, shipDragStyle, sizeStyleVar]"
    @mouseup="reset"
    @keyup="handleRotation"
  >
    <!-- {{ x }}, {{ y }} -->
  </div>
</template>

<style lang="scss" scoped>
.ship {
  z-index: 10;
  border-radius: 5px;
  /* height: 45px; */
  /* width: 45px; */
  /* width: 225px; */

  position: fixed;
  background: red;

  &:hover {
    cursor: pointer;
  }
}
</style>
