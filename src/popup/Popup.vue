<template>
  <div class="my-container">
    <it-checkbox
      v-for="flag of mutatedFlags"
      :key="flag.id"
      type="primary"
      :label="flag.name"
      v-model="flag.active"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { FeatureFlag } from "@/logic/feature-flag";
import { deepCopy } from "@/utils/deep-copy";

export default defineComponent({
  name: "Popup",
  props: {
    flags: {
      type: Object as PropType<FeatureFlag[]>,
      required: true,
    },
  },
  data() {
    return {
      mutatedFlags: deepCopy(this.flags),
    };
  },
});
</script>
<style>
.my-container {
  width: 300px;
  height: 300px;
}
</style>
