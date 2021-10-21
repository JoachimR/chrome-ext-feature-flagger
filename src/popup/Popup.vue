<template>
  <div
    class="width-300px height-300px display-flex flex-direction-column border"
  >
    <PopupMain
      class="flex-1 overflow-y-hidden"
      :feature-flags="featureFlags"
      @update="onUpdate"
      @close="onCloseFeatureFlag"
    />
    <PopupFooter
      :show-submit="showSubmit"
      :url="info.url"
      :feature-flags="featureFlags"
      :hostname="urlHostname"
      @add="onAddFeatureFlag"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { FeatureFlag, UrlHostname } from "@/popup/model";
import { collectFeatureFlags } from "@/logic/collect-feature-flags";
import PopupMain from "@/popup/PopupMain.vue";
import PopupFooter from "@/popup/PopupFooter.vue";
import { deepCopy } from "@/utils/deep-copy";
import { haveActiveFeatureFlagsChanged } from "@/logic/have-active-feature-flags-changed";
import { storeFeatureFlags } from "@/browser-extension/storage";
import { haveFeatureFlagsChanged } from "@/logic/have-feature-flags-changed";

export interface PopupPayload {
  url: string;
  storedFeatureFlags: FeatureFlag[];
}

export default defineComponent({
  components: {
    PopupFooter,
    PopupMain,
  },
  props: {
    info: Object,
  },
  setup(props) {
    const urlHostname = ref<UrlHostname | null>("");
    let originalFeatureFlags: FeatureFlag[] = [];
    // eslint-disable-next-line no-undef
    const featureFlags = ref<FeatureFlag[]>([]);

    const onValidUrl = (
      {
        hostname,
        searchParams,
      }: {
        hostname: string;
        searchParams: URLSearchParams;
      },
      storedFeatureFlags: FeatureFlag[]
    ) => {
      urlHostname.value = hostname;
      const collectedFlags: FeatureFlag[] = collectFeatureFlags(searchParams);
      originalFeatureFlags = deepCopy<FeatureFlag[]>(collectedFlags);
      featureFlags.value = deepCopy<FeatureFlag[]>(collectedFlags);

      for (let storedFeatureFlag of storedFeatureFlags) {
        if (
          !featureFlags.value.some(
            (flag) => flag.parameter === storedFeatureFlag.parameter
          )
        ) {
          featureFlags.value.push({
            parameter: storedFeatureFlag.parameter,
            isActive: false,
          });
        }
      }
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

    const onFeatureFlagsMutated = (newFeatureFlags: FeatureFlag[]) => {
      if (haveFeatureFlagsChanged(featureFlags.value, newFeatureFlags)) {
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

    const showSubmit = computed<boolean>(() => {
      return haveActiveFeatureFlagsChanged(
        originalFeatureFlags,
        featureFlags.value
      );
    });

    function applyNewInfo(info: PopupPayload) {
      const validUrl = extractValidUrl(info.url);
      if (validUrl) {
        onValidUrl(validUrl, info.storedFeatureFlags);
      } else {
        onInvalidUrl();
      }
    }

    watch(
      () => props.info,
      (info) => {
        if (info) {
          applyNewInfo(info as PopupPayload);
        }
      },
      { deep: true }
    );

    watch(
      () => [...featureFlags.value],
      (newFeatureFlags) => {
        if (haveFeatureFlagsChanged(originalFeatureFlags, newFeatureFlags)) {
          if (urlHostname.value !== null) {
            storeFeatureFlags(urlHostname.value, deepCopy(newFeatureFlags));
          }
        }
      },
      { deep: true }
    );

    onMounted(() => {
      if (props.info) {
        applyNewInfo(props.info as PopupPayload);
      }
    });

    return {
      urlHostname,
      featureFlags,
      showSubmit,
      onFeatureFlagsMutated,
      onFeatureFlagAdd,
      onFeatureFlagRemove,
    };
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
  border: 5px solid #1c3967;
}
.overflow-y-hidden {
  overflow-y: hidden;
}
</style>
