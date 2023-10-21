import { reactive, watch } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from './stores/useAuthStore'
import { useApi } from '@/services/api'

export const state = reactive({
  connected: false,
  game: {},
  games: []
})

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://localhost:3000'

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

socket.on('game-created', () => {
  socket.emit('get-games')
})

socket.on('disconnect', () => {
  state.connected = false
})

socket.on('games', (games) => {
  state.games = games
})

socket.on('user-joined', async ({ game }) => {
  const { get } = useApi(`/api/game/${game._id}`)

  get().then((response) => {
    state.game = response
  })
})

socket.on('board-click', async ({ game }) => {
  const { get } = useApi(`/api/game/${game._id}`)

  get().then((response) => {
    state.game = response
  })
})
