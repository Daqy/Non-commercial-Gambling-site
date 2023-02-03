import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/minesweeper",
    name: "minesweeper",
    component: () => import("../views/MinesweeperView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
