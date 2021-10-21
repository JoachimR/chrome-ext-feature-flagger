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
import { closePopup } from "@/popup/logic/browser-extension/popup";
import { createNewUrl } from "@/popup/logic/create-new-url";

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
      const currentUrlString = urlRef.value;
      if (!currentUrlString) {
        return null;
      }
      return createNewUrl(
        currentUrlString,
        featureFlagsRef.value as FeatureFlag[]
      );
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
