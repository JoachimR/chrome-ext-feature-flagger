import { createApp } from "vue";
import App from "./App.vue";
import store, { key } from "../store";
import { VuesticPlugin } from "vuestic-ui";
import "vuestic-ui/dist/vuestic-ui.css";

const app = createApp(App);

app.use(store, key);
app.use(VuesticPlugin);

app.mount("#app");
