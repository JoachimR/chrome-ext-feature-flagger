import { createApp } from "vue";
import App from "./App.vue";

// @ts-ignore
import WaveUI from "wave-ui";
import "wave-ui/dist/wave-ui.css";
import "@mdi/font/css/materialdesignicons.min.css";

const app = createApp(App);

new WaveUI(app);

app.mount("#app");
