<template>
  <div id="app">
    <HeaderTmp/>
    <MinesweeperCards/>
  </div>
</template>

<script>
  import HeaderTmp from './components/header.vue'
import MinesweeperCards from './components/minesweeperCards.vue'

export default {
  name: 'app',
  components: {
    HeaderTmp,
    MinesweeperCards
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
  body {
    margin: 0px;
    padding: 0px;
    background-color: #343A40;
    overflow-x: hidden;
  }
</style>
