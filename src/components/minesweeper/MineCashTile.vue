<script lang="ts" setup>
import { prettify } from '@/services/prettify'
defineProps<{
  earn: number
}>()
</script>

<template>
  <div class="money-container">
    <p>+{{ prettify(earn) }}</p>
  </div>
</template>

<style lang="scss" scoped>
.money-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-hightlight-green);

  p {
    color: var(--color-text-bright-bg);
    font-size: 1.2em;
  }
}
</style>
