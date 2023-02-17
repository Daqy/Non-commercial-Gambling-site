<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import LogoTextComponent from "./components/LogoTextComponent.vue";
import GameTemplate from "./components/GameTemplate.vue";
import IconMinesweeper from "./components/icons/IconMinesweeper.vue";
</script>

<template>
  <div class="viewableContent">
    <LogoTextComponent title="Just Bet" />
    <GameTemplate title="minesweeper" :icon="IconMinesweeper">
      <RouterView />
    </GameTemplate>
  </div>
</template>

<style scoped>
.viewableContent {
  width: 60%;
  min-width: 1000px;
  max-width: 1300px;
}
</style>
