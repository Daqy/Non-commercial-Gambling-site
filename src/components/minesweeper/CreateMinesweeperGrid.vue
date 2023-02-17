<script lang="ts" setup>
import { reactive, ref, inject, computed } from "vue";

const props = defineProps({
  state: { type: String, required: true },
});

const _state = inject("states");
const betAmount = ref();

const emit = defineEmits(["createGame"]);

function preventAlphaKey(event) {
  const allowedValues = "1234567890".split("");
  if (!allowedValues.includes(event.key) && event.key !== "Backspace") {
    event.preventDefault();
  }
}

function truncate(value: number) {
  if (value.toString().includes("."))
    return Number(value.toString().slice(0, value.toString().indexOf(".") + 3));
  return value;
}

function changeCurrentActive(id: number) {
  for (let multiplier of bombMultipliers.get) {
    multiplier.isActive = false;
  }
  bombMultipliers.get[id].isActive = true;
}

function createGame() {
  const balance = Number(localStorage.getItem("balance"));
  if (betAmount.value == undefined || betAmount.value == "") {
    console.log("enter bet");
    return;
  }
  const bombMultiplier = bombMultipliers.get[CurrentMultiplier.value].value;
  emit("createGame", {
    betAmount: betAmount.value,
    multiplier: bombMultiplier,
  });
  localStorage.setItem("balance", `${balance - betAmount.value}`);
  window.dispatchEvent(
    new CustomEvent("balance-local-storage-changed", {
      detail: {
        storage: Number(localStorage.getItem("balance")),
      },
    })
  );
}

const CurrentMultiplier = computed(() => {
  for (const bomb of bombMultipliers.get) {
    if (bomb.isActive) return bombMultipliers.get.indexOf(bomb);
  }
  return -1;
});

const gameIsOnGoing = computed(() => {
  return props.state == _state.ONGOING;
});

const bombMultipliers = reactive({
  get: [
    {
      value: 1,
      isActive: true,
    },
    {
      value: 3,
      isActive: false,
    },
    {
      value: 5,
      isActive: false,
    },
    {
      value: 24,
      isActive: false,
    },
  ],
});
</script>

<template>
  <div class="container">
    <input
      type="text"
      v-model.number="betAmount"
      @keydown="preventAlphaKey"
      placeholder="Bet amount.."
      class="betAmount"
    />
    <div class="numberBombContainer">
      <div
        class="multiplier"
        v-for="(multiplier, index) in bombMultipliers.get"
        :key="index"
        :class="{ active: multiplier.isActive }"
        @click="changeCurrentActive(index)"
      >
        {{ multiplier.value }}
      </div>
    </div>
    <!-- Next Click Reward: {{ truncate(props.nextClickReward) }} -->
    <button class="createGame" :disabled="gameIsOnGoing" @click="createGame">
      create game
    </button>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  > * {
    width: 100%;
    background-color: var(--color-container-subtle);
    color: white;
    overflow: hidden;
    width: 80%;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    border-radius: 5px;
    min-height: 40px;
    margin: 5px 0px;
    border: none;
    aspect-ratio: 8/1;
    font-weight: bold;
    font-size: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.betAmount {
  padding: 0px 10px;
}

.createGame:disabled {
  color: var(--color-text-subtle);
  text-transform: capitalize;
}

.createGame:not(:disabled) {
  text-transform: capitalize;
  /* background-color: var(--color-create-game-button); */
  /* color: var(--color-create-game-button-text); */
  border: 2px solid var(--color-create-game-button);
  color: var(--color-create-game-button);

  &:hover {
    cursor: pointer;
    /* background-color: #20c536; */
    /* color: var(--color-create-game-button); */
    /* background-color: var(--color-create-game-button-text); */
    /* background-color: var(--color-hightlight-green); */
    background-color: var(--color-create-game-button);
    color: var(--color-create-game-button-text);
  }
}

.multiplier {
  position: relative;
  flex-grow: 1;
  height: 100%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-text-subtle);

  &:hover {
    cursor: pointer;
    box-shadow: rgb(0, 0, 0, 0.2) 3px 3px 6px 0px inset,
      rgba(0, 0, 0, 0.2) -3px -3px 6px 1px inset;
  }
}

.numberBombContainer > div:not(:last-child) {
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

.active {
  box-shadow: rgb(0, 0, 0, 0.2) 3px 3px 6px 0px inset,
    rgba(0, 0, 0, 0.2) -3px -3px 6px 1px inset;
}
</style>
