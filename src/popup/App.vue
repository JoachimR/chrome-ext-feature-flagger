<template>
  <w-app>
    <Popup :info="info" />
  </w-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Popup, { InfoProp } from "@/popup/Popup.vue";
import {
  initPopup,
  registerListenerForUrlChange,
  TabId,
  unknownTabId,
} from "@/chrome/tabs";
import { loadStoredFeatureFlags } from "@/chrome/storage";
import { FeatureFlag } from "@/popup/model";

export default defineComponent({
  components: { Popup },
  setup() {
    const tabIdRef = ref<TabId>(unknownTabId);
    const infoRef = ref<InfoProp>({
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
.flex-grow {
  flex-grow: 1;
}
.flex-1 {
  flex: 1;
}
.justify-flex-end {
  justify-content: flex-end;
}
.justify-center {
  justify-content: center;
}
.justify-space-between {
  justify-content: space-between;
}
.align-items-center {
  align-items: center;
}
.align-content-center {
  align-content: center;
}
.overflow-auto {
  overflow: auto;
}
.border-bottom {
  border-bottom: 1px solid #1C3967;
}
.margin-left-4px {
  margin: 4px;
}
.margin-2px {
  margin: 2px;
}
.margin-4px {
  margin: 4px;
}
.padding-right-8px {
  padding-right: 8px;
}
.margin-vertical-2px {
  margin-top: 2px;
  margin-bottom: 2px;
}
.padding-4px {
  padding: 4px;
}
.padding-vertical-4px {
  padding-top: 4px;
  padding-bottom: 4px;
}
.padding-horizontal-4px {
  padding-left: 4px;
  padding-right: 4px;
}
.padding-horizontal-8px {
  padding-left: 8px;
  padding-right: 8px;
}

.display-inline {
  display: inline;
}
</style>
