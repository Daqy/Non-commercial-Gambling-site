<script lang="ts" setup>
import BombSVG from "../icons/IconMinesweeper.vue";
import MouseClickSVG from "../icons/IconMouseClick.vue";
import CoinSVG from "../icons/IconCoin.vue";
import { computed, inject, onMounted, ref, watch } from "vue";

import { truncate } from "@/utils/truncate";
import { injectStrict } from "@/utils/injectTyped";
import { AxiosKey } from "@/symbols";

const axios = injectStrict(AxiosKey);

const _state = inject("states");
const props = defineProps({
  state: { type: String, required: true },
  gameid: { type: Number, required: true },
});

const emit = defineEmits(["stateChange"]);

const userid = ref(localStorage.getItem("id"));

watch(
  () => props.gameid,
  async () => {
    await axios
      .get(`/api/game/${props.gameid}/getBombCount?userid=${userid.value}`)
      .then((res) => {
        bombCount.value = res.data.bombCount;
      });
    await axios
      .get(
        `/api/game/${props.gameid}/getNextClickReward?userid=${userid.value}`
      )
      .then((res) => {
        nextClickReward.value = res.data.clickReward;
      });
    await axios
      .get(`/api/game/${props.gameid}/getStake?userid=${userid.value}`)
      .then((res) => {
        stake.value = res.data.stake;
      });
    await axios
      .get(`/api/game/${props.gameid}/getPotential?userid=${userid.value}`)
      .then((res) => {
        potentialEarned.value = res.data.potential;
      });
  }
);

watch(
  () => props.state,
  async () => {
    await axios
      .get(`/api/game/${props.gameid}/getPotential?userid=${userid.value}`)
      .then((res) => {
        potentialEarned.value = res.data.potential;
      });
  }
);

async function claimRewards() {
  await axios
    .post(
      `/api/game/${props.gameid}/updateState?userid=${userid.value}&state=${_state.CLAIMED}`
    )
    .then((res) => {
      console.log(res.data);
      emit("stateChange");
    });
  await axios
    .post(
      `/api/update-balance?userid=${userid.value}&balanceChange=${potentialEarned.value}`
    )
    .then((res) => {
      window.dispatchEvent(
        new CustomEvent("animate_balance_change", {
          detail: {
            balanceChange: potentialEarned.value,
          },
        })
      );
    });
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

const bombCount = ref(0);
const nextClickReward = ref(0);
const stake = ref(0);
const potentialEarned = ref(0);

onMounted(async () => {
  await axios
    .get(`/api/game/${props.gameid}/getBombCount?userid=${userid.value}`)
    .then((res) => {
      bombCount.value = res.data.bombCount;
    });
  await axios
    .get(`/api/game/${props.gameid}/getNextClickReward?userid=${userid.value}`)
    .then((res) => {
      nextClickReward.value = res.data.clickReward;
    });
  await axios
    .get(`/api/game/${props.gameid}/getStake?userid=${userid.value}`)
    .then((res) => {
      stake.value = res.data.stake;
    });
  await axios
    .get(`/api/game/${props.gameid}/getPotential?userid=${userid.value}`)
    .then((res) => {
      potentialEarned.value = res.data.potential;
    });
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
          {{ bombCount }}
        </div>
      </div>
      <div class="earnPerClick" title="Earn Per Click">
        <div class="svgContainer">
          <MouseClickSVG fill="var(--color-text-subtle)" />
        </div>
        <div class="textContainer">
          {{ truncate(nextClickReward, 3) }}
        </div>
      </div>
    </div>

    <div
      class="claimRewards"
      @click="claimRewards"
      v-if="claimRewardsAvaliable"
    >
      claim ${{ truncate(potentialEarned, 3) }}
    </div>
    <div class="claimedRewards" v-if="hasClaimedRewards">
      claimed: ${{ truncate(potentialEarned, 3) }}
    </div>
    <div class="lostRewards" v-if="HasLostGame">
      you lost ${{ truncate(potentialEarned, 3) }}
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
