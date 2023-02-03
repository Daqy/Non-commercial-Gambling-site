<script setup>
import { defineProps, toRefs } from "vue";
import CoinSVG from "./CoinSVG.vue";

const props = defineProps({
  balance: Number,
});

function displayBalance(balance) {
  const stringBalance = balance.toString();
  return stringBalance.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
}

const { balance } = toRefs(props);
</script>

<template>
  <div class="balanceContainer">
    <p class="balance">balance:</p>
    <p class="value">{{ displayBalance(balance) }}</p>
    <div class="svgContainer">
      <CoinSVG :mainColour="'#009638'" :secondaryColour="'#03ff75'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$color: #03ff75;

.balanceContainer {
  height: 33px;
  border-radius: 10px;
  display: flex;
  justify-self: right;
  /* padding: 10px; */
  box-sizing: border-box;
  min-width: 124px;

  p {
    font-weight: bold;
    margin: 0px;
    align-self: center;
  }
  .balance {
    color: #46546b;
    margin-right: 10px;

    text-transform: uppercase;
  }
}

.svgContainer {
  height: 70%;
  align-self: center;
  aspect-ratio: 1/1;
  margin: 0px 5px 0px 5px;
}
</style>
