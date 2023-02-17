<script lang="ts" setup>
import BombSVG from "../icons/IconMinesweeper.vue";
import MouseClickSVG from "../icons/IconMouseClick.vue";
import CoinSVG from "../icons/IconCoin.vue";
import { computed, inject } from "vue";

const _state = inject("states");
const props = defineProps({
  state: { type: String, required: true },
  cashEarnt: { type: Number, required: true },
  stake: { type: Number, required: true },
  bombCount: { type: Number, required: true },
  nextClickReward: { type: Number, required: true },
});

function truncate(value: number) {
  if (value.toString().includes("."))
    return Number(value.toString().slice(0, value.toString().indexOf(".") + 3));
  return value;
}

const emit = defineEmits(["stateChange", "claimAmount"]);

function claimRewards() {
  emit("stateChange", _state.CLAIMED);
  emit("claimAmount");
  const balance = Number(localStorage.getItem("balance"));
  localStorage.setItem("balance", `${balance + props.cashEarnt}`);
  window.dispatchEvent(
    new CustomEvent("balance-local-storage-changed", {
      detail: {
        storage: Number(localStorage.getItem("balance")),
      },
    })
  );

  // props.state = _state.CLAIMED;
}

const claimRewardsAvaliable = computed(() => {
  return props.state == _state.ONGOING;
});

const hasClaimedRewards = computed(() => {
  return props.state == _state.CLAIMED;
});

const HasLostGame = computed(() => {
  return props.state == _state.LOST;
});

const showBombCount = computed(() => {
  if (props.state == _state.LOST) return props.bombCount + 1;
  return props.bombCount;
});
</script>

<template>
  <div class="wrapper">
    <div class="currentGameContainer">
      <div class="stakeInGame" title="Money Put In">
        <div class="svgContainer">
          <CoinSVG
            mainFill="var(--color-text-subtle)"
            secondaryFill="var(--color-container-titles)"
          />
        </div>
        <div class="textContainer">{{ stake }}</div>
      </div>
      <div class="bombCount" title="Bomb Count">
        <div class="svgContainer">
          <BombSVG fill="var(--color-text-subtle)" />
        </div>
        <div class="textContainer">
          {{ showBombCount }}
        </div>
      </div>
      <div class="earnPerClick" title="Earn Per Click">
        <div class="svgContainer">
          <MouseClickSVG fill="var(--color-text-subtle)" />
        </div>
        <div class="textContainer">
          {{ truncate(props.nextClickReward) }}
        </div>
      </div>
    </div>

    <div
      class="claimRewards"
      @click="claimRewards"
      v-if="claimRewardsAvaliable"
    >
      claim ${{ truncate(cashEarnt) }}
    </div>
    <div class="claimedRewards" v-if="hasClaimedRewards">
      claimed: ${{ truncate(cashEarnt) }}
    </div>
    <div class="lostRewards" v-if="HasLostGame">
      you lost ${{ truncate(cashEarnt) }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  flex-grow: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > div:first-child {
    margin-bottom: 20px;
  }
}

.claimRewards,
.claimedRewards,
.lostRewards {
  /* flex-grow: 1; */
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  aspect-ratio: 8/1;
  min-height: 40px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: capitalize;
}

.claimRewards {
  background-color: var(--color-claim-button);
  color: var(--color-claim-button-text);

  &:hover {
    cursor: pointer;
  }
}

.lostRewards {
  /* background-color: var(--color-lost-button); */
  /* color: var(--color-lost-button-text); */
  color: var(--color-bomb-background);
}

.claimedRewards {
  /* background-color: var(--color-create-game-button); */
  /* color: var(--color-create-game-button-text); */
  color: var(--color-create-game-button);
}

.currentGameContainer {
  display: flex;
  /* grid-template-columns: repeat(3, 1fr); */
  justify-content: space-around;
  width: 80%;

  > div {
    border-radius: 5px;
    width: 25%;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

    /* aspect-ratio: 3/1.5; */
    /* aspect-ratio: 1/1; */
    background-color: var(--color-container-subtle);
  }
}

.svgContainer {
  width: 100%;
  height: 50%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: var(--color-container-titles);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px 5px 0px 0px;

  svg {
    height: 75%;
    aspect-ratio: 1/1;
  }
}

.textContainer {
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-text-subtle);
}
</style>
