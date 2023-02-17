<script lang="ts" setup>
import IconMinesweeper from "@/components/icons/IconMinesweeper.vue";
import { computed } from "@vue/runtime-core";
import { inject } from "vue";

const _state = inject("states");

const props = defineProps({
  state: String,
});

const isLosingState = computed(() => {
  return props.state == _state.LOST;
});

const computedBackground = computed(() => {
  if (isLosingState.value)
    return "background-color: var(--color-bomb-background)";
  return "";
});
</script>

<template>
  <div
    class="card"
    :class="{ winner: !isLosingState }"
    :style="computedBackground"
  >
    <IconMinesweeper />
  </div>
</template>

<style lang="scss" scoped>
.winner::after {
  content: "";
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.4;
  position: absolute;
}
.card {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: shake 0.5s 2;

  svg {
    width: 50%;
  }
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>
