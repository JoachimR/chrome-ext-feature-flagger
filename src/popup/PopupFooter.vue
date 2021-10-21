<template>
  <div>
    <div class="display-flex padding-horizontal-4px align-items-center">
      <w-input
        maxlength="99"
        v-model="newFeatureFlagParameter"
        @keyup.enter="onAddNewFeatureFlagParameter"
      >
        Add new feature flag
      </w-input>
      <div class="margin-4px">
        <w-button
          bg-color="primary"
          icon="mdi mdi-plus"
          :disabled="!newFeatureFlagParameter"
          @click="onAddNewFeatureFlagParameter"
        />
      </div>
    </div>
    <div class="display-flex padding-horizontal-4px align-items-center">
      <w-input :model-value="newUrl" readonly />
      <div class="margin-4px">
        <w-button
          bg-color="success"
          icon="mdi mdi-refresh"
          :disabled="!showSubmit"
          @click="onSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
import { FeatureFlag } from "@/popup/model";
import { reloadTabWithUrl } from "@/chrome/tabs";
import { collectFeatureFlags } from "@/logic/collect-feature-flags";
import { closePopup } from "@/chrome/popup";

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
        this.$emit("add", this.newFeatureFlagParameter);
        this.newFeatureFlagParameter = "";
      }
    },
  },
});
</script>
