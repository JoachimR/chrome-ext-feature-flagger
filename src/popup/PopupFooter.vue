<template>
  <div class="display-flex padding-horizontal-4px align-items-center">
    <el-input :value="newUrl" readonly size="mini" />
    <div class="margin-4px">
      <el-button
        type="primary"
        icon="el-icon-refresh"
        size="mini"
        :disabled="!showSubmit"
        @click="onClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue";
import { FeatureFlag } from "@/popup/model";
import { setTabUrl } from "@/popup/set-tab-url";

export default defineComponent({
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
  methods: {
    onClick() {
      setTabUrl(this.newUrl);
    },
  },
});
</script>
<style scoped>
.text-align-center {
  text-align: center;
}

.overflow-hidden {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.width-100 {
  width: 100%;
}
</style>
