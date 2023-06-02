import { computed, createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import http from "@/http";
import { AxiosKey } from "@/symbols";

import "./assets/main.css";

const app = createApp(App);

app.provide("states", {
  ONGOING: "ongoing",
  CLAIMED: "claimed",
  LOST: "lost",
  FIRSTGAME: "firstgame",
});
app.provide(AxiosKey, http);

app.use(router);

app.mount("#app");
