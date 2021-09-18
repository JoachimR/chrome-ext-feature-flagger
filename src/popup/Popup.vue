<template>
  <div class="width-300px height-300px display-flex flex-direction-column">
    <div class="height-10 display-flex align-items-center">
      <h2 class="width-100">{{ urlHostname }}</h2>
    </div>
    <div class="height-60 overflow-auto">
      <div
        v-for="i in [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1,
        ]"
        :key="i"
      >
        <it-checkbox
          v-for="flag of featureFlags"
          :key="flag[0]"
          type="primary"
          :label="flag[0]"
          v-model="flag[1]"
        />
      </div>
    </div>
    <div class="height-30 overflow-auto">
      <h2 class="width-100">History</h2>
      <div>{{ historyForUrlHostname }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { deepCopy } from "@/utils/deep-copy";
import {
  FeatureFlag,
  FeatureFlagsRecord,
  HistoryUrlRecord,
  UrlHostname,
} from "@/model";
import { useStore } from "vuex";
import { key } from "@/store";
import { collectFeatureFlags } from "@/logic/collect-feature-flags";
import { featureFlagsToFeatureFlagsRecord } from "@/logic/feature-flags-to-feature-flags-record";

export default defineComponent({
  name: "Popup",
  props: {
    url: {
      type: String,
    },
  },
  setup(props) {
    const store = useStore(key);
    const history: HistoryUrlRecord = store.state.history;

    const urlHostname = ref<UrlHostname | null>("");
    const featureFlags = ref<FeatureFlag[]>([]);
    const historyForUrlHostname = computed<FeatureFlagsRecord>(() => {
      const hostname = urlHostname.value;
      return hostname ? history[hostname] : {};
    });

    const onValidUrl = ({
      hostname,
      searchParams,
    }: {
      hostname: string;
      searchParams: URLSearchParams;
    }) => {
      urlHostname.value = hostname;
      const collectedFlags: FeatureFlag[] = collectFeatureFlags(searchParams);
      featureFlags.value = deepCopy<FeatureFlag[]>(collectedFlags);
      history[hostname] = featureFlagsToFeatureFlagsRecord(collectedFlags);
    };
    const onInvalidUrl = () => {
      urlHostname.value = null;
      featureFlags.value = [];
    };

    const extractValidUrl = (
      url: string | undefined
    ): { hostname: string; searchParams: URLSearchParams } | undefined => {
      const urlString = url ?? "";
      if (urlString) {
        const url = new URL(urlString);
        const hostname = url.hostname;
        if (hostname) {
          return { hostname, searchParams: url.searchParams };
        }
      }
      return undefined;
    };

    const onUrlChanged = () => {
      const validUrl = extractValidUrl(props.url);
      if (validUrl) {
        onValidUrl(validUrl);
      } else {
        onInvalidUrl();
      }
    };

    return {
      urlHostname,
      featureFlags,
      historyForUrlHostname,
      onUrlChanged,
    };
  },
  watch: {
    url: "onUrlChanged",
  },
  mounted() {
    this.onUrlChanged();
  },
});
</script>
<style>
.width-300px {
  width: 300px;
}

.height-300px {
  height: 300px;
}

.display-flex {
  display: flex;
}

.flex-direction-column {
  flex-direction: column;
}

.overflow-auto {
  overflow: auto;
}

.align-items-center {
  align-items: center;
}
.width-100 {
  width: 100%;
}

.height-10 {
  height: 10%;
}
.height-60 {
  height: 60%;
}
.height-30 {
  height: 30%;
}
</style>
