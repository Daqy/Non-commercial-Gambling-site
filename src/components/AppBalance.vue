<script lang="ts" setup>
import { useAuthStore } from '~stores/useAuthStore'
import { Icons } from '~components/icons'
import { computed, watch, ref } from 'vue'
import AppSkeletonLoader from './AppSkeletonLoader.vue'
import anime from 'animejs/lib/anime.es.js'
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

const difference = ref(0)

watch(
  () => authStore.balance,
  (to, from) => {
    if (from) {
      difference.value = to - from
      anime({
        targets: '.difference',
        duration: 500,
        autoplay: true,
        translateY: [0, difference.value < 0 ? 10 : -10],
        opacity: [1, 0],
        easing: 'linear'
      })
    }
  }
)

const differenceStyle = computed(() => {
  return difference.value < 0
    ? 'top: 1rem;color: var(--color-bomb-background);'
    : 'top: -1rem;color: var(--color-hightlight-green);'
})
</script>

<template>
  <div class="balance-container" :style="{ width: loading ? '20rem' : '' }">
    <p v-if="!loading">
      <span> balance: </span>

      <span>
        <span class="difference" :style="differenceStyle"
          >{{ difference < 0 ? '' : '+' }}{{ prettify(difference) }}</span
        >
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
