import Equal from 'equal-vue'
import { createApp } from 'vue'
import App from './App.vue'
import 'equal-vue/dist/style.css'

import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App)

app.use(pinia)

// import { Tag, Input, Button } from "equal-vue";
// import "equal-vue/dist/style.css";
//
// app.use(Tag).use(Input).use(Button);

app.use(Equal)

app.mount('#app')
