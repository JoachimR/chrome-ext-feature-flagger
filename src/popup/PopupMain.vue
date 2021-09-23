<template>
  <TransferTags :items="tagItems" @update="onTagsModified" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { FeatureFlag, TagItem } from "@/popup/model";
import TransferTags from "@/popup/TransferTags.vue";
import { tagItemToFeatureFlag } from "@/logic/tag-item-to-feature-flag";
import { featureFlagToTagItem } from "@/logic/feature-flag-to-tag-item";

export default defineComponent({
  components: { TransferTags },
  props: {
    featureFlags: {
      type: Object as FeatureFlag[],
    },
  },
  emits: ['update'],
  setup(props) {
    const tagItems = ref<TagItem[]>([]);
    const onNewFeatureFlags = () => {
      const flags = props.featureFlags ?? [];
      tagItems.value = flags.map(featureFlagToTagItem);
    };
    return {
      tagItems,
      onNewFeatureFlags,
    };
  },
  watch: {
    featureFlags: "onNewFeatureFlags",
  },
  mounted() {
    this.onNewFeatureFlags();
  },
  methods: {
    onTagsModified(tags: TagItem[]) {
      this.$emit("update", tags.map(tagItemToFeatureFlag));
    },
  },
});
</script>
