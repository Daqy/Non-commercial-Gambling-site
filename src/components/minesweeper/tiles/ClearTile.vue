<script lang="ts" setup>
defineProps({ earn: { type: Number, required: true } });
</script>

<template>
  <div class="card">
    <p>+{{ earn }}</p>
  </div>
</template>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-hightlight-green);

  p {
    color: var(--color-text-bright-bg);
    font-size: 1.2em;
  }
}
</style>
