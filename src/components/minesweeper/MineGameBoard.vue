<script lang="ts" setup>
import AppSkeletonLoader from '@/components/AppSkeletonLoader.vue'

const props = withDefaults(
  defineProps<{
    perRow?: number
    loading?: boolean
  }>(),
  {
    loading: false,
    perRow: 5
  }
)
</script>

<template>
  <div class="grid" v-if="!loading">
    <slot />
  </div>
  <div class="skeleton-grid-loader" v-else>
    <AppSkeletonLoader height="100%" />
    <p>Looking for game...</p>
  </div>
</template>

<style lang="scss" scoped>
.skeleton-grid-loader,
.grid {
  width: 80%;
  height: 80%;
}

.skeleton-grid-loader {
  border-radius: 0.75rem;
  overflow: hidden;

  p {
    position: absolute;
    top: 50%;
    color: var(--color-text-subtle);
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.grid {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
}
</style>
