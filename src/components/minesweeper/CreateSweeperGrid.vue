<script lang="ts" setup></script>

<template>
  <div class="createContainer">
    <div class="betAmountContainer"></div>
    <div class="multiplyerContainer">
      <div>1</div>
      <div>3</div>
      <div>5</div>
      <div>24</div>
    </div>
    <div class="createGameContainer"></div>
  </div>
</template>

<style lang="scss" scoped>
.createContainer {
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
}

.betAmountContainer,
.multiplyerContainer,
.createGameContainer {
  display: flex;
  width: 60%;
  background-color: #222c3d;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  font-weight: bold;
  border-radius: 5px;
  height: 40px;
  margin: 5px 0px;
}
.multiplyerContainer {
  > div {
    position: relative;
    flex-grow: 1;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-content: center;
    color: #46546b;

    &:hover {
      cursor: pointer;
      box-shadow: rgb(0, 0, 0, 0.2) 3px 3px 6px 0px inset,
        rgba(0, 0, 0, 0.2) -3px -3px 6px 1px inset;
    }
  }

  > div:not(:last-child) {
    &::after {
      content: "";
      position: absolute;
      background-color: #2c374a;
      width: 2px;
      height: 80%;
      top: 50%;
      transform: translate(0%, -50%);
      right: -1px;
    }
  }
}
</style>
