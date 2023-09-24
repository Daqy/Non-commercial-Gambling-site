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
  console.log('rotate', props.id, isDragging.value && event.key)
  if (isDragging.value && (event.key === 'r' || event.key === 'R')) {
    isHorizontal.value = !isHorizontal.value
    emitPosition()
  }
}

const sizeStyleVar = computed(() => {
  if (isHorizontal.value) {
    return `height: ${grid.size}px; width: ${grid.size * props.id + grid.gap * (props.id - 1)}px`
  }
  return `height: ${grid.size * props.id + grid.gap * (props.id - 1)}px; width: ${grid.size}px`
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

watch(
  () => [x.value, y.value],
  () => {
    emitPosition()
  }
)

emit('functions', { id: props.id, reset, reposition })
</script>

<template>
  <div
    tabindex="0"
    ref="shipRef"
    class="ship"
    :style="[positionStyles, shipDragStyle, sizeStyleVar]"
    :class="{ dragging: isDragging }"
    @keyup="handleRotation"
    @mouseup="emit('release', id)"
  >
    <!-- {{ x }}, {{ y }} -->
  </div>
</template>

<style lang="scss" scoped>
.ship {
  z-index: 10;
  border-radius: 5px;

  position: fixed;
  background: red;

  &:hover {
    cursor: pointer;
  }
}

.dragging {
  z-index: 11;
}
</style>
