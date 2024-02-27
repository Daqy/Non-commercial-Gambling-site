<script lang="ts" setup>
import { useAuthStore } from '~stores/useAuthStore'
import { Icons } from '~components/icons'
import { computed, watch, ref, nextTick } from 'vue'
import AppSkeletonLoader from './AppSkeletonLoader.vue'
import { prettify } from '@/services/prettify'

const props = withDefaults(
  defineProps<{
    loading?: boolean
  }>(),
  {
    loading: false
  }
)

const authStore = useAuthStore()

const difference = ref()

watch(
  () => authStore.balance,
  (to, from) => {
    if (from) {
      difference.value = to - from
    }
  }
)

const computedStyle = computed(() => {
  return difference.value < 0
    ? 'color: var(--color-bomb-background);'
    : 'color: var(--color-hightlight-green);'
})
</script>

<template>
  <div class="balance-container" :style="{ width: loading ? '20rem' : '' }">
    <p v-if="!loading">
      <span> balance: </span>
      <span>
        <span
          v-if="difference"
          ref="element"
          class="difference"
          :class="difference < 0 ? 'animate-neg' : 'animate-pos'"
          :style="computedStyle"
        >
          {{ difference < 0 ? '' : '+' }}{{ prettify(difference) }}
        </span>
        <span class="balance">{{ prettify(authStore.balance) }}</span>
      </span>
      <component :is="Icons.coin" />
    </p>
    <AppSkeletonLoader height="2rem" v-else />
  </div>
</template>

<style lang="scss" scoped>
.difference {
  position: absolute;
  color: var(--color-text-title);
  right: 0px;
  margin: 0px 5px;
  opacity: 0;
}

.animate-pos {
  animation: BalanceChangePositive 0.5s linear;
}

.animate-neg {
  animation: BalanceChangeNegative 0.5s linear;
}

@keyframes BalanceChangePositive {
  from {
    opacity: 1;
    top: -1rem;
  }
  to {
    opacity: 0;
    top: -2rem;
  }
}

@keyframes BalanceChangeNegative {
  from {
    opacity: 1;
    top: 1rem;
  }
  to {
    opacity: 0;
    top: 2rem;
  }
}
.balance-container {
  text-transform: uppercase;
  color: var(--color-text-subtle);
  max-width: 20rem;

  p {
    display: flex;
    align-items: center;
  }

  .balance {
    color: var(--color-text-title);
    margin: 0px 5px;
  }

  svg {
    height: 28px;
  }
}
</style>
