import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

// import { Tag, Input, Button } from "equal-vue";
// import "equal-vue/dist/style.css";
//
// app.use(Tag).use(Input).use(Button);

import Equal from "equal-vue";
import "equal-vue/dist/style.css";

app.use(Equal);

app.mount("#app");
