<script setup lang="ts"></script>

<template>
  <div class="emptyTileContainer">
    <p class="amountEarned">+100</p>
  </div>
</template>

<style lang="scss" scoped>
.emptyTileContainer {
  width: 100%;
  height: 100%;
  background-color: #03ff75; // #009638  #03ff75
  display: flex;
  justify-content: center;
  align-items: center;
}

.amountEarned {
  font-weight: bold;
  color: black;
  font-size: 1.2em;
}
</style>
