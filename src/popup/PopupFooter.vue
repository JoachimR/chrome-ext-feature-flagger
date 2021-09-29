<template>
  <div>
    <div class="display-flex padding-horizontal-4px align-items-center">
      <va-input
        v-model="newFeatureFlagParameter"
        @keyup.enter="onAddNewFeatureFlagParameter"
        placeholder="Add new feature flag"
      />
      <div class="margin-4px">
        <va-button
          icon="add"
          :disabled="!newFeatureFlagParameter"
          @click="onAddNewFeatureFlagParameter"
        />
      </div>
    </div>
    <div class="display-flex padding-horizontal-4px align-items-center">
      <va-input :model-value="newUrl" readonly />
      <div class="margin-4px">
        <va-button
          icon="refresh"
          :disabled="!showSubmit"
          @click="onClickSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
import { FeatureFlag } from "@/popup/model";
import { reloadTabWithUrl } from "@/chrome";

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
      type: Object as FeatureFlag[],
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
      const featureFlags: FeatureFlag[] = featureFlagsRef.value;
      for (const featureFlag of featureFlags) {
        url.searchParams.set(
          featureFlag.parameter,
          featureFlag.isActive ? 1 : 0
        );
      }
      return url;
    });
    return {
      newUrl,
    };
  },
  data() {
    return {
      newFeatureFlagParameter: "",
    };
  },
  methods: {
    onAddNewFeatureFlagParameter() {
      if (this.newFeatureFlagParameter) {
        this.$emit("add", this.newFeatureFlagParameter);
        this.newFeatureFlagParameter = "";
      }
    },
    onClickSubmit() {
      reloadTabWithUrl(this.newUrl);
    },
  },
});
</script>
