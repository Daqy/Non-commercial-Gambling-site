import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '~stores/useAuthStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/minesweeper',
      name: 'minesweeper',
      component: () => import('~pages/MinesweeperView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('~pages/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('~pages/RegisterView.vue'),
      meta: { requiresAuth: false }
    }
  ]
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth) {
    if (!(await authStore.isAuthenticated())) return { name: 'login' }
    return true
  }
  return true
})

export default router
