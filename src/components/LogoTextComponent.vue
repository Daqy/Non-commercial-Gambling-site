<script lang="ts" setup>
import { computed } from "@vue/runtime-core";

const props = defineProps({
  title: {
    type: String,
    required: true,
    validator(value: string) {
      return value.includes(" ");
    },
  },
});

const formattedTitle = computed(() => {
  return props.title
    ?.split(" ")
    .map((title, index) => {
      if (index == 0) return `<span class="colouredText">${title}</span>`;
      return title;
    })
    .join("");
});
</script>

<template>
  <h1 v-html="formattedTitle" />
</template>

<style scoped lang="scss">
h1 {
  text-transform: uppercase;
  margin: 15px 0px;
}

:deep(.colouredText) {
  color: var(--color-hightlight-green);
  margin-right: 8px;

  &::after {
    position: absolute;
    content: "";
    width: 5px;
    height: 5px;
    background-color: var(--color-hightlight-green);
    top: 50%;
    transform: translate(0%, 0%) rotate(45deg);
  }
}
</style>
