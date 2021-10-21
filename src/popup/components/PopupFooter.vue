<template>
  <div>
    <div class="display-flex padding-horizontal-4px align-items-center">
      <div class="flex-1">
        <it-input
          placeholder="Add new feature flag"
          v-model="newFeatureFlagParameter"
          @keyup.enter="onAddNewFeatureFlagParameter"
          class="flex-1"
        />
      </div>
      <div class="margin-4px">
        <it-button
          icon="add"
          :disabled="!newFeatureFlagParameter"
          @click="onAddNewFeatureFlagParameter"
        />
      </div>
    </div>
    <div class="display-flex padding-horizontal-4px align-items-center">
      <div class="flex-1"><it-input :model-value="newUrl" readonly /></div>
      <div class="margin-4px">
        <it-button icon="refresh" :disabled="!showSubmit" @click="onSubmit" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
import { FeatureFlag } from "@/popup/model/model";
import { reloadTabWithUrl } from "@/popup/logic/browser-extension/tabs";
import { collectFeatureFlags } from "@/popup/logic/collect-feature-flags";
import { closePopup } from "@/popup/logic/browser-extension/popup";

export default defineComponent({
  emits: ["add"],
  props: {
    url: {
      type: String,
    },
    showSubmit: {
      type: Boolean,
    },
    featureFlags: {
      type: Object,
    },
  },
  setup(props) {
    const urlRef = toRefs(props).url;
    const featureFlagsRef = toRefs(props).featureFlags;

    const newUrl = computed<URL | null>(() => {
      const currentUrl = urlRef.value;
      if (!currentUrl) {
        return null;
      }
      const url: URL = new URL(currentUrl);
      const featureFlags = featureFlagsRef.value as FeatureFlag[];

      const collectedFlags = collectFeatureFlags(url.searchParams);
      for (const collectedFlag of collectedFlags) {
        let flag = featureFlags.find(
          (flag) => flag.parameter === collectedFlag.parameter
        );
        if (!flag || !flag.isActive) {
          url.searchParams.delete(collectedFlag.parameter);
        }
      }

      for (const featureFlag of featureFlags.filter((flag) => flag.isActive)) {
        url.searchParams.set(featureFlag.parameter, "1");
      }
      url.searchParams.sort();
      return url;
    });

    const onSubmit = async () => {
      const url = newUrl.value;
      if (url !== null) {
        await reloadTabWithUrl(url);
        closePopup();
      }
    };

    return {
      newUrl,
      onSubmit,
    };
  },
  data() {
    return { newFeatureFlagParameter: "" };
  },
  methods: {
    onAddNewFeatureFlagParameter() {
      if (this.newFeatureFlagParameter) {
        const value = this.newFeatureFlagParameter.substring(0, 99);
        this.$emit("add", value);
        this.newFeatureFlagParameter = "";
      }
    },
  },
});
</script>
