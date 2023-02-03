<script setup lang="ts">
import { ref, defineProps, toRefs, defineEmits, computed } from "vue";
import MineTile from "./MineTile.vue";
import EmptyTile from "./EmptyTile.vue";

const props = defineProps({
  isMine: Boolean,
  revealCards: Boolean,
});

const { isMine, revealCards } = toRefs(props);

let click = ref(false);

let flipCard = computed({
  get() {
    if (flipCard.value) return true;
    if (revealCards.value) return revealCards.value && isMine.value;
    else return click.value;
  },
  set(value) {
    return value;
  },
});
// let flipCard = ref(revealCards.value && isMine.value);
let showBackCard = computed({
  get() {
    if (showBackCard.value) return true;
    if (revealCards.value) return revealCards.value && isMine.value;
    else return click.value;
  },
  set(value) {
    return value;
  },
});

const emit = defineEmits(["mineHit"]);

const onClick = () => {
  if (revealCards.value) return;
  click.value = true;
  showBackCard.value = true;
  if (isMine.value) {
    emit("mineHit");
  }
};
</script>

<template>
  <div class="sweeper" @click="onClick">
    <div id="inner" :class="{ animate: flipCard }">
      <div class="flipCardfront"></div>
      <div class="flipCardBack">
        <MineTile v-if="isMine && showBackCard" />
        <EmptyTile v-if="!isMine && showBackCard" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sweeper {
  border-radius: 10px;
  position: relative;

  &:hover {
    cursor: pointer;
  }
}

#inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}

.flipCardfront,
.flipCardBack {
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
  height: 100%;
}

.flipCardfront {
  background-color: #1a2332;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    width: 150%;
    height: 100%;
    transform: rotate(45deg) translate(-10%, 68%);
    background-color: #151e2d;
  }
  /* &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 150%;
    transform: rotate(45deg) translate(33%, -10%);
    background-color: black;
    opacity: 0.2;
  } */
}

.flipCardBack {
  transform: rotateY(180deg);
}

.animate {
  transform: rotateY(180deg);
}
</style>
