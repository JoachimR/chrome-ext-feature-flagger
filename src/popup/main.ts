import { createApp } from "vue";
import App from "./App.vue";
import store, { key } from "../store";

// @ts-ignore
import WaveUI from "wave-ui";
import "wave-ui/dist/wave-ui.css";
import "@mdi/font/css/materialdesignicons.min.css";

const app = createApp(App);

new WaveUI(app, {});

app.use(store, key);

app.mount("#app");
