<script lang="ts" setup>
import { useDraggable } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps<{
  initialPosition: { x: number; y: number }
}>()

const ship = ref()

const { x, y, style } = useDraggable(ship, {
  initialValue: { x: props.initialPosition.x, y: props.initialPosition.y }
})

const reset = () => {
  x.value = props.initialPosition.x
  y.value = props.initialPosition.y
}
</script>

<template>
  <div ref="ship" class="ship" :style="style" @mouseup="reset">{{ x }}{{ y }}</div>
</template>

<style lang="scss" scoped>
.ship {
  border-radius: 5px;
  height: 45px;
  /* width: 45px; */
  width: 225px;

  position: fixed;
  background: red;
}
</style>
