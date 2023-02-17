import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/minesweeper",
      name: "minesweeper",
      component: () => import("../views/MinesweeperView.vue"),
    },
    {
      path: "/:catchAll(.*)",
      redirect: { name: "minesweeper" },
    },
  ],
});

export default router;
