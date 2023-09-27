import { reactive, watch } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from './stores/useAuthStore'
import { useApi } from '@/services/api'

export const state = reactive({
  connected: false,
  game: {}
})

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://192.168.1.102:3000'

export const socket = io(URL, {
  auth: (cb) => {
    const authStore = useAuthStore()
    watch(
      () => authStore.token,
      () => {
        if (authStore.token) {
          cb({ token: authStore.token })
        }
      }
    )
    // cb({
    //   token: undefined
    // })
  }
})

socket.on('connect', () => {
  state.connected = true
})

socket.on('disconnect', () => {
  state.connected = false
})

socket.on('board-click', async ({ game }) => {
  const { get } = useApi(`/api/game/${game._id}`)

  get().then((response) => {
    state.game = response
  })
})
