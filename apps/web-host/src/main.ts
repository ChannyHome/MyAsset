import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import { createAppRouter } from "./router";
import { useUiStore } from "./stores/ui";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();
const router = createAppRouter(pinia);

app.use(pinia);
app.use(router);

const uiStore = useUiStore(pinia);
uiStore.initialize();

app.mount("#app");
