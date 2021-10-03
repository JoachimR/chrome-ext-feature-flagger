<template>
  <div
    class="width-300px height-300px display-flex flex-direction-column border"
  >
    <PopupMain
      class="flex-1"
      :feature-flags="featureFlags"
      @update="onUpdate"
      @close="onCloseFeatureFlag"
    />
    <PopupFooter
      :show-submit="showSubmit"
      :url="url"
      :feature-flags="featureFlags"
      :hostname="urlHostname"
      @add="onAddFeatureFlag"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import {
  FeatureFlag,
  FeatureFlagsRecord,
  HistoryUrlRecord,
  UrlHostname,
} from "@/popup/model";
import { useStore } from "vuex";
import { key } from "@/store";
import { collectFeatureFlags } from "@/logic/collect-feature-flags";
import { featureFlagsToFeatureFlagsRecord } from "@/logic/feature-flags-to-feature-flags-record";
import PopupMain from "@/popup/PopupMain.vue";
import PopupFooter from "@/popup/PopupFooter.vue";
import { deepCopy } from "@/utils/deep-copy";
import { haveActiveFeatureFlagsChanged } from "@/logic/have-active-feature-flags-changed";

export default defineComponent({
  components: {
    PopupFooter,
    PopupMain,
  },
  props: {
    url: {
      type: String,
    },
  },
  setup(props) {
    const store = useStore(key);
    const history: HistoryUrlRecord = store.state.history;

    const urlHostname = ref<UrlHostname | null>("");
    const originalFeatureFlags = ref<FeatureFlag[]>([]);
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
      originalFeatureFlags.value = deepCopy<FeatureFlag[]>(collectedFlags);
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

    const onFeatureFlagsMutated = (newFeatureFlags: FeatureFlag[]) => {
      if (haveActiveFeatureFlagsChanged(featureFlags.value, newFeatureFlags)) {
        featureFlags.value = newFeatureFlags;
      }
    };

    const onFeatureFlagAdd = (newActiveParameter: string) => {
      if (newActiveParameter) {
        const index = featureFlags.value.findIndex(
          (flag) => flag.parameter === newActiveParameter
        );
        if (index === -1) {
          featureFlags.value.push({
            parameter: newActiveParameter,
            isActive: true,
          });
        } else {
          if (!featureFlags.value[index].isActive) {
            featureFlags.value[index].isActive = true;
          }
        }
      }
    };
    const onFeatureFlagRemove = (parameter: string) => {
      const index = featureFlags.value.findIndex(
        (flag) => flag.parameter === parameter
      );
      if (index > -1) {
        featureFlags.value.splice(index, 1);
      }
    };

    const showSubmit = computed<boolean>(() =>
      haveActiveFeatureFlagsChanged(
        originalFeatureFlags.value,
        featureFlags.value
      )
    );

    return {
      urlHostname,
      featureFlags,
      historyForUrlHostname,
      onUrlChanged,
      onFeatureFlagsMutated,
      onFeatureFlagAdd,
      onFeatureFlagRemove,
      showSubmit,
    };
  },
  watch: {
    url: "onUrlChanged",
  },
  mounted() {
    this.onUrlChanged();
  },
  methods: {
    onUpdate(featureFlags: FeatureFlag[]) {
      this.onFeatureFlagsMutated(featureFlags);
    },
    onAddFeatureFlag(parameter: string) {
      this.onFeatureFlagAdd(parameter);
    },
    onCloseFeatureFlag(parameter: string) {
      this.onFeatureFlagRemove(parameter);
    },
  },
});
</script>
<style scoped>
.width-300px {
  min-width: 300px;
  width: 300px;
  max-width: 300px;
}
.height-300px {
  height: 300px;
  min-height: 300px;
  max-height: 300px;
}
.border {
  border: 3px solid #154ec1;
}
</style>
