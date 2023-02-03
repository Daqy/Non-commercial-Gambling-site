<script setup lang="ts">
import WebpageTitle from "@/components/WebpageTitle.vue";
</script>

<template>
  <div>
    <div class="navContainer">
      <WebpageTitle />
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
body {
  background-color: #131c2b;
  margin: 0px;
  padding: 0px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.navContainer {
  width: 60%;
  min-width: 1000px;
  display: flex;
  align-items: center;
}
</style>
