<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useAuthStore } from '~stores/useAuthStore'

import { useApi } from '~services/api'
const { loading, get } = useApi('/api/get-claim')

const authStore = useAuthStore()

function claimReward() {
  const { post } = useApi('/api/claim-reward')

  post(authStore.token).then((value) => {
    claimable.value = { claimable: value.claimable, timestamp: value.timestamp }
    authStore.balance = value.balance
    timeDifference()
  })

  return
}

const claimable = ref()

// watch(
//   () => authStore.token,
//   (to, from) => {

//   }
// )

const timestamp = ref()

function truncateTime(time: number) {
  return time.toString().split('.')[0]
}

function prettifyTime(time: string) {
  const newTime = parseInt(time) % 60
  // console.log(time.substring(time.length - 2, time.length))
  // console.log
  return `${newTime < 10 ? '0' : ''}${newTime}`
  // if (parseInt(time) > 100)
}

function timeDifference() {
  if (claimable.value && !claimable.value.claimable) {
    if (loading.value) return
    if (claimable.value.timestamp < Date.now()) {
      get().then((value) => {
        claimable.value = value
        timeDifference()
      })
    }
    const serverDate = new Date(claimable.value.timestamp)
    const now = new Date(Date.now())

    const diffTime = Math.abs(now - serverDate) / 1000
    const hrs = truncateTime(diffTime / 60 / 60)
    const mins = prettifyTime(truncateTime(diffTime / 60))
    const seconds = prettifyTime(truncateTime(diffTime))
    timestamp.value = `${hrs}:${mins}:${seconds}`
  }
}

onMounted(() => {
  get().then((value) => {
    claimable.value = value
    timeDifference()
  })
  setInterval(timeDifference, 1000)
})

// const timestamp = computed(() => {})
</script>

<template>
  <p class="claimable" v-if="claimable?.claimable" @click="claimReward">claim your daily</p>
  <p v-else-if="claimable && !claimable.claimable">claim in {{ timestamp }}</p>
</template>

<style lang="scss" scoped>
p {
  color: var(--color-text-subtle);
}

.claimable:hover {
  color: white;
  cursor: pointer;
  text-decoration: underline;
}

/* .claimable {
  color: white;
} */
</style>
