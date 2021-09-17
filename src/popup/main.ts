import { createApp } from "vue";
import App from "./App.vue";
import store, { key } from "../store";
import Equal from "equal-vue";
import "equal-vue/dist/style.css";

const app = createApp(App);

app.use(store, key);

app.use(Equal);

app.mount("#app");
