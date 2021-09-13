<template>
  <div>
    <Popup :flags="flags" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Popup from "@/popup/Popup.vue";

export default defineComponent({
  name: "App",
  components: { Popup },
  data() {
    return {
      flags: [
        { id: "1", name: "hello", active: false },
        { id: "2", name: "world", active: true },
        { id: "3", name: "good", active: false },
        { id: "4", name: "bye", active: false },
      ],
    };
  },
});
</script>
