<template lang="pug">
.page
  .nav.h-12.w-full
    c-navbar(:balance="this.balance")
  .main
    c-generate(@clicked="createGame" :balance="this.balance")
    c-sweeper(@clicked="increaseBalance" :newGame="this.game")
</template>

<script>
import minesweeper from "@/components/sweeper.vue";
import createGame from "@/components/createGame.vue";
import navbar from "@/components/navbar.vue";

export default {
  data() {
    return {
      game: {},
      balance: 10000
    };
  },
  components: {
    "c-sweeper": minesweeper,
    "c-generate": createGame,
    "c-navbar": navbar
  },
  methods: {
    createGame(game) {
      this.game = game;
      this.balance = this.game.actualBalance;
    },
    increaseBalance(value) {
      this.balance += value;
    }
  }
};
</script>

<style lang="stylus">

</style>