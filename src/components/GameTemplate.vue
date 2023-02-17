<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { computed, watch } from "@vue/runtime-core";
import IconCoin from "./icons/IconCoin.vue"; // importing is easier too

const props = defineProps({
  icon: { type: null, required: true },
  title: { type: String, required: true },
});

function truncate(value: number) {
  if (value.toString().includes("."))
    return Number(value.toString().slice(0, value.toString().indexOf(".")));
  return value;
}

// let balance = Number(localStorage.getItem("balance"));
// let balance = ref(Number(localStorage.getItem("balance")));

if (localStorage.getItem("balance") == null) {
  localStorage.setItem("balance", "1000");
}
const balance = ref(Number(localStorage.getItem("balance")));

//here you can see me use, props, slots and just refs
// const balance = ref(10000);

watch(balance, (newBalance) => {
  console.log(newBalance);
});
const gained = ref(false);
const gainedAmount = ref(0);
const lost = ref(false);
const lostAmount = ref(0);

window.addEventListener(
  "balance-local-storage-changed",
  (event: { detail: { storage: number } }) => {
    if (balance.value < event.detail.storage) {
      gained.value = true;
      gainedAmount.value = event.detail.storage - balance.value;
    } else {
      lost.value = true;
      lostAmount.value = balance.value - event.detail.storage;
    }
    const animated = document.getElementsByClassName("value")[0];

    animated.addEventListener("animationend", () => {
      gained.value = false;
      lost.value = false;
    });
    balance.value = event.detail.storage;
  }
);

//

const displayGained = computed(() => {
  return truncate(gainedAmount.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+$)/g, "$1,");
});

const displayLost = computed(() => {
  return truncate(lostAmount.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+$)/g, "$1,");
});

const displayBalance = computed(() => {
  return truncate(balance.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+$)/g, "$1,");
});
</script>

<template>
  <div class="gameContainer">
    <div class="gameTitleContainer">
      <div class="gameIconContainer">
        <component :is="props.icon" />
      </div>
      <h2>{{ props.title }}</h2>
      <div class="balanceContainer">
        <p class="balance">
          balance:
          <span class="value">
            <div class="lost" v-if="lost" :class="{ fadeOut: lost }">
              -{{ displayLost }}
            </div>
            {{ displayBalance }}
            <div class="gained" v-if="gained" :class="{ fadeOut: gained }">
              +{{ displayGained }}
            </div>
          </span>
        </p>
        <IconCoin />
      </div>
    </div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.gameContainer {
  background-color: var(--color-container-main);
  width: 100%;
  aspect-ratio: 3.35/2;
  display: flex;
  overflow: hidden;
  border-radius: 10px;
  flex-direction: column;
}

.gameTitleContainer {
  min-width: 100%;
  min-height: 75px;
  background-color: var(--color-container-titles);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  display: flex;
  align-items: center;
  text-transform: capitalize;
  padding: 0px 20px;

  h2 {
    margin-right: auto;
  }
}

.gained,
.lost {
  position: absolute;
  top: 100%;
  right: 0%;
}
.gained {
  color: var(--color-hightlight-green);
}

.lost {
  color: var(--color-bomb-background);
}

.fadeOut {
  animation: fadeOut 1.5s forwards;
}

@keyframes fadeOut {
  10% {
    transform: translate(0%, 0%);
    opacity: 1;
  }
  100% {
    transform: translate(0%, 100%);
    opacity: 0;
  }
}

.gameIconContainer {
  height: 40%;
  aspect-ratio: 1/1;
  margin-right: 10px;
}

.balanceContainer {
  height: 33px;
  display: flex;
  min-width: 124px;
  align-items: center;

  > svg {
    height: 85%;
    aspect-ratio: 1/1;
  }
}

.balance {
  text-transform: uppercase;
  color: var(--color-text-subtle);
  display: flex;
  margin-right: 5px;
  .value {
    margin-left: 5px;
    color: var(--color-text-title);
  }
}
</style>
