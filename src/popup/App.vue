<template>
  <div>
    <Popup :feature-flags="featureFlags" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Popup from "@/popup/Popup.vue";
import { getCurrentTabUrl } from "@/popup/get-current-tab-url";
import { FeatureFlag } from "@/model";
import { collectFeatureFlags } from "@/logic/collect-feature-flags";

export default defineComponent({
  name: "App",
  components: { Popup },
  data(): { featureFlags: FeatureFlag[] } {
    return {
      featureFlags: [],
    };
  },
  mounted(): void {
    getCurrentTabUrl((url) => {
      this.featureFlags = collectFeatureFlags(url);
    });
  },
});
</script>
