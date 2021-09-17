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
import { FeatureFlag } from "@/model";
import { useStore } from "vuex";
import { key } from "@/store";

export default defineComponent({
  name: "Popup",
  props: {
    featureFlags: {
      type: Object,
    },
  },
  setup(props) {
    const store = useStore(key);

    const history = store.state.history; // todo

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
