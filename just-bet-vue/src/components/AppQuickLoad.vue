<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import anime from 'animejs/lib/anime.es.js'

const spinner = ref(null)

onMounted(() => {
  anime({
    targets: spinner.value,
    duration: 1000,
    autoplay: true,
    loop: true,
    rotate: 360,
    easing: 'linear'
  })
})

defineProps<{
  isLoading: boolean
  spinnerColor: string
  spinnerBackground: string
}>()
</script>

<template>
  <div
    class="loader"
    v-if="isLoading"
    :style="`--bg-color-quick-load: ${spinnerBackground};--color-of-quick-spinner: ${spinnerColor}`"
  >
    <div class="spinner" ref="spinner"></div>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  border-radius: 100%;
  background: var(--color-of-quick-spinner);
  overflow: hidden;
  height: 80%;
  aspect-ratio: 1/1;

  .spinner {
    width: 100%;
    height: 100%;

    &::after {
      position: absolute;
      content: '';
      width: 50%;
      height: 50%;
      background: var(--bg-color-quick-load);
    }
  }

  &::after {
    border-radius: 100%;
    top: 10%;
    left: 10%;
    position: absolute;
    content: '';
    width: 80%;
    height: 80%;
    background: var(--bg-color-quick-load);
  }
}
</style>
