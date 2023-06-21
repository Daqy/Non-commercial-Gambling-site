<script lang="ts" setup>
const props = defineProps<{
  heading: string
}>()
</script>

<template>
  <div class="main-container">
    <div class="heading-container">
      <div class="icon">
        <slot name="icon" />
      </div>
      <slot name="heading">
        <h2>{{ heading }}</h2>
      </slot>
      <div class="side-container">
        <slot name="extra" />
      </div>
    </div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.main-container {
  max-width: 1000px;
  background-color: var(--color-container-main);
  width: 100%;
  aspect-ratio: 3.35/2;
  display: flex;
  overflow: hidden;
  border-radius: 10px;
  flex-direction: column;
}

.heading-container {
  background-color: var(--color-container-titles);
  width: 100%;
  min-width: 100%;
  min-height: 75px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  display: flex;
  align-items: center;
  text-transform: capitalize;
  padding: 0px 20px;

  & > h2 {
    margin-right: auto;
  }
}

.side-container {
  margin-left: auto;
}

.icon {
  height: 40%;
  aspect-ratio: 1/1;
  margin-right: 10px;
}
</style>
