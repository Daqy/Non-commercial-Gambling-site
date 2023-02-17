import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.provide("states", {
  ONGOING: "ONGOING",
  CLAIMED: "CLAIMED",
  LOST: "LOST",
  FIRSTGAME: "FIRSTGAME",
});

app.use(router);

app.mount("#app");
