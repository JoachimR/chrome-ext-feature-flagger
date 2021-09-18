<template>
  <div>
    <Popup :url="url" :feature-flags="featureFlags" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Popup from "@/popup/Popup.vue";
import { getCurrentTabUrl } from "@/popup/get-current-tab-url";

export default defineComponent({
  name: "App",
  components: { Popup },
  data(): { url: string } {
    return {
      url: "",
    };
  },
  mounted(): void {
    getCurrentTabUrl((url) => {
      this.url = url;
    });
  },
});
</script>
