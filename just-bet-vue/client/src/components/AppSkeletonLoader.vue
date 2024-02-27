<script lang="ts" setup>
withDefaults(
  defineProps<{
    height?: string
    color?: string
  }>(),
  {
    height: '50px',
    color: 'var(--color-default-skeleton-loader)'
  }
)
</script>

<template>
  <div
    class="skeleton-container"
    :style="`--custom-height-skeleton: ${height};--custom-color-skeleton: ${color}; --custom-color-midpoint: hsl(from var(--custom-color-skeleton) h s 13%)`"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.skeleton-container {
  width: 100%;
  height: var(--custom-height-skeleton);

  background: linear-gradient(
    90deg,
    var(--custom-color-skeleton) 0%,
    var(--custom-color-skeleton) 35%,
    var(--custom-color-midpoint) 50%,
    var(--custom-color-skeleton) 65%,
    var(--custom-color-skeleton) 100%
  );

  background-size: 200% 100%;
  background-position: 125% 0%;
  animation: Gradient 1.5s ease infinite 5s;
}

@keyframes Gradient {
  0% {
    background-position: 125% 0%;
  }
  100% {
    background-position: -25% 0%;
  }
}
</style>
