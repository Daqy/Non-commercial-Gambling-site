<script lang="ts" setup>
import BombTile from "./BombTile.vue";
import { computed, ref, inject, useSlots, watch } from "vue";
const _state = inject("states");

const props = defineProps({
  autoFlip: {
    type: Boolean,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  isBomb: {
    type: Boolean,
  },
  reset: {
    type: Boolean,
  },
});

const showBack = ref(false);
const slots = useSlots();

watch(
  () => props.reset,
  (reset) => {
    if (reset) {
      showBack.value = false;
    }
  }
);

const flip = computed(() => {
  if (props.state == _state.CLAIMED && props.isBomb) return true;
  if (props.autoFlip) return props.autoFlip;
  return showBack.value;
});

function flipCard() {
  if (props.state != _state.ONGOING) return;
  showBack.value = true;
}
</script>

<template>
  <div class="tile">
    <div class="card" :class="{ flip: flip }" @click="flipCard">
      <div class="front" />
      <div class="back">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$radius: 5px;
.tile {
  border-radius: $radius;

  &:hover {
    cursor: pointer;
  }
}

.card {
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}

.front,
.back {
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: $radius;
  overflow: hidden;
}

.front {
  background-color: var(--color-card-main);

  &::before {
    content: "";
    position: absolute;
    width: 150%;
    height: 100%;
    transform: rotate(45deg) translate(-10%, 68%);
    background-color: var(--color-card-highlight);
  }
}

.back {
  transform: rotateY(180deg);
}

.flip {
  animation: flip 1s forwards;
  animation-delay: 0;
}

@keyframes flip {
  100% {
    transform: rotateY(180deg);
  }
}
</style>
