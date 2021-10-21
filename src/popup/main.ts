import { createApp } from "vue";
import App from "./App.vue";
import Equal from "equal-vue";
import "equal-vue/dist/style.css";

const app = createApp(App);

// import { Tag, Input, Button } from "equal-vue";
// import "equal-vue/dist/style.css";
//
// app.use(Tag).use(Input).use(Button);

app.use(Equal);

app.mount("#app");
