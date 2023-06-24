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

watch(
  () => authStore.token,
  (to, from) => {
    get().then((value) => {
      claimable.value = value
      console.log(claimable.value)
      timeDifference()
    })

    // get().then((response: { username: string; balance: number }) => {
    //   if (response) {
    //     authStore.username = response.username
    //     authStore.balance = response.balance
    //   }
    // })
  }
)

const timestamp = ref() //1687555403385

function timeDifference() {
  console.log(claimable.value)
  if (claimable.value) {
    const serverDate = new Date(claimable.value.timestamp)
    const now = new Date(Date.now())
    const hours = serverDate.getHours() - now.getHours()
    const minutes = serverDate.getMinutes() - now.getMinutes()
    timestamp.value = `${hours}hrs ${minutes}mins`
    // if (hours === 0 && minutes === 0) {
    //   get().then((value) => {
    //     claimable.value = value
    //     console.log(claimable.value)
    //     timeDifference()
    //   })
    // }
  }
}

onMounted(() => {
  setInterval(timeDifference, 60000)
})

// const timestamp = computed(() => {})
</script>

<template>
  <p v-if="claimable?.claimable" @click="claimReward">claim your daily</p>
  <p v-else-if="claimable && !claimable.claimable">claim in: {{ timestamp }}</p>
</template>
