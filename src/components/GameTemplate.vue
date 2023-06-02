<script setup lang="ts">
import { onMounted, inject } from "vue";
import { ref } from "@vue/reactivity";
import { computed, watch } from "@vue/runtime-core";
import IconCoin from "./icons/IconCoin.vue";

import { truncate } from "@/utils/truncate";
import { injectStrict } from "@/utils/injectTyped";
import { AxiosKey } from "@/symbols";

const axios = injectStrict(AxiosKey);

const props = defineProps({
  icon: { type: null, required: true },
  title: { type: String, required: true },
});

const userid = ref(0);
const balance = ref(0);
const username = ref("undefined");

async function getUserInfo() {
  await axios.get(`/api/get-balance?userid=${userid.value}`).then((res) => {
    balance.value = res.data.balance;
  });
  await axios.get(`/api/get-username?userid=${userid.value}`).then((res) => {
    username.value = res.data.username;
  });
}

onMounted(async () => {
  if (localStorage.getItem("id") == undefined) {
    let username = prompt("Please enter your name");
    await axios.post(`/api/user?username=${username}`).then((res) => {
      userid.value = res.data.userid;
      localStorage.setItem("id", res.data.userid);
      getUserInfo();
    });
  } else {
    userid.value = localStorage.getItem("id");
    getUserInfo();
  }
});

const change = ref({ state: false, amount: 0 });

window.addEventListener(
  "animate_balance_change",
  async (event: { detail: { balanceChange: number } }) => {
    change.value.state = true;
    change.value.amount = event.detail.balanceChange;

    const animated = document.getElementsByClassName("value")[0];

    animated.addEventListener("animationend", () => {
      change.value.state = false;
      change.value.amount = false;
    });
    await axios.get(`/api/get-balance?userid=${userid.value}`).then((res) => {
      balance.value = res.data.balance;
    });
  }
);

//

const displayChangedBalanced = computed(() => {
  return change.value.amount < 0
    ? "-"
    : "+" +
        truncate(change.value.amount, 0)
          .toString()
          .replace(/(\d)(?=(\d{3})+$)/g, "$1,");
});

const displayBalance = computed(() => {
  return truncate(balance.value, 0)
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
            <div
              v-if="change.state"
              :class="{
                fadeOut: change.state,
                lost: change.amount < 0,
                gained: change.amount > 0,
              }"
            >
              {{ displayChangedBalanced }}
            </div>
            {{ displayBalance }}
          </span>
        </p>
        <IconCoin />
      </div>
    </div>
    <slot />
  </div>

  <div class="footer">
    <p class="username">Logged in as {{ username }}</p>
    <p class="copyright">© 2023 Daqy Develops & Co</p>
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

.footer {
  width: 100%;
  flex-grow: 1;
  padding: 50px 40px;
  display: flex;
  align-items: flex-start;
  color: var(--color-text-subtle);
  display: flex;
  justify-content: space-between;
}

.username {
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
