<template>
  <w-app>
    <Popup :info="info" />
  </w-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Popup, { PopupPayload } from "@/popup/components/Popup.vue";
import { initPopup, registerListenerForUrlChange } from "@/popup/logic/browser-extension/tabs";
import { loadStoredFeatureFlags } from "@/popup/logic/browser-extension/storage";
import { FeatureFlag } from "@/popup/model/model";
import { TabId, unknownTabId } from "@/popup/logic/browser-extension/chrome/chrome-api";

export default defineComponent({
  components: { Popup },
  setup() {
    const tabIdRef = ref<TabId>(unknownTabId);
    const infoRef = ref<PopupPayload>({
      url: "",
      storedFeatureFlags: [],
    });

    onMounted(() => {
      initPopup((tabId: number, url: string) => {
        tabIdRef.value = tabId;
        loadStoredFeatureFlags(url, (result: FeatureFlag[]) => {
          infoRef.value = { url, storedFeatureFlags: result };
        });
      });

      registerListenerForUrlChange((tabId: number, url: string) => {
        if (tabIdRef.value !== unknownTabId && tabIdRef.value === tabId) {
          loadStoredFeatureFlags(url, (result) => {
            infoRef.value = { url, storedFeatureFlags: result };
          });
        }
      });
    });

    return { tabId: tabIdRef, info: infoRef };
  },
});
</script>

<style>
body {
  margin: 0;
}
.display-flex {
  display: flex;
}
.flex-direction-column {
  flex-direction: column;
}
.flex-1 {
  flex: 1;
}
.align-items-center {
  align-items: center;
}
.overflow-auto {
  overflow: auto;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.border-bottom {
  border-bottom: 1px solid #1c3967;
}
.border-right {
  border-right: 1px solid #1c3967;
}
.margin-vertical-4px {
  margin-top: 4px;
  margin-bottom: 4px;
}
.margin-4px {
  margin: 4px;
}
.padding-right-16px {
  padding-right: 16px;
}
.padding-4px {
  padding: 4px;
}
.padding-horizontal-4px {
  padding-left: 4px;
  padding-right: 4px;
}
.display-inline {
  display: inline;
}
</style>
