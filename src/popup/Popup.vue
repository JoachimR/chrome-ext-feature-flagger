<template>
  <div class="my-container">
    <it-checkbox
      v-for="flag of localFeatureFlags"
      :key="flag.parameter"
      type="primary"
      :label="flag.parameter"
      v-model="flag.active"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { deepCopy } from "@/utils/deep-copy";
import { FeatureFlag } from "@/model/feature-flag";

export default defineComponent({
  name: "MyComponent",
  props: {
    featureFlags: {
      type: Object,
    },
  },
  setup(props) {
    const localFeatureFlags = ref<FeatureFlag[]>([]);
    const refreshLocalFeatureFlags = async () => {
      localFeatureFlags.value = deepCopy<FeatureFlag[]>(
        props.featureFlags as FeatureFlag[]
      );
    };
    return {
      localFeatureFlags,
      refreshLocalFeatureFlags,
    };
  },
  watch: {
    featureFlags: "refreshLocalFeatureFlags",
  },
  mounted() {
    this.refreshLocalFeatureFlags();
  },
});
</script>
<style>
.my-container {
  width: 300px;
  height: 300px;
}
</style>
