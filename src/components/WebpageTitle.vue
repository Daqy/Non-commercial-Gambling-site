<template>
  <h1><span class="colored-text">JUST</span>BET</h1>
</template>

<style lang="scss" scoped>
$color: #03ff75;

h1 {
  position: relative;
  .colored-text {
    color: $color;
    margin-right: 5px;
  }
}

.colored-text::after {
  position: absolute;
  content: "";
  width: 4px;
  height: 4px;
  background-color: $color;
  top: 50%;
  transform: translate(0%, -50%) rotate(45deg);
}
</style>
