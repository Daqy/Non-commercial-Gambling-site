<script setup lang="ts">
import { ref } from "vue";

import SweeperTile from "./tile/SweeperTile.vue";

let revealCards = ref(false);

const onMineHit = () => {
  revealCards.value = true;
};
</script>

<template>
  <div class="minesweeperGrid">
    <SweeperTile
      v-for="n in 25"
      :key="n"
      :isMine="n > 12"
      :revealCards="revealCards"
      @mineHit="onMineHit"
    />
  </div>
</template>

<style lang="scss" scoped>
.minesweeperGrid {
  height: 80%;
  aspect-ratio: 1/1;
  display: grid;
  grid-template: repeat(5, 1fr) / repeat(5, 1fr);
  grid-gap: 10px;
}
</style>
