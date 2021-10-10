<template>
  <TransferTags
    :items="tagItems"
    @update="onTagsModified"
    @close="onCloseTag"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { FeatureFlag, TagItem } from "@/popup/model";
import { tagItemToFeatureFlag } from "@/logic/tag-item-to-feature-flag";
import { featureFlagToTagItem } from "@/logic/feature-flag-to-tag-item";
import TransferTags from "@/popup/TransferTags.vue";

export default defineComponent({
  components: { TransferTags },
  props: {
    featureFlags: {
      type: Object,
    },
  },
  emits: ["update", "close"],
  setup(props) {
    const tagItems = ref<TagItem[]>([]);
    const onNewFeatureFlags = (featureFlags: FeatureFlag[]) => {
      const flags = featureFlags ?? [];
      tagItems.value = flags.map(featureFlagToTagItem);
    };

    watch(
      () => props.featureFlags,
      (featureFlags) => {
        onNewFeatureFlags((featureFlags ?? []) as FeatureFlag[]);
      },
      { deep: true }
    );

    onMounted(() => {
      onNewFeatureFlags((props.featureFlags ?? []) as FeatureFlag[]);
    });

    return {
      tagItems,
    };
  },
  methods: {
    onTagsModified(tags: TagItem[]) {
      this.$emit("update", tags.map(tagItemToFeatureFlag));
    },
    onCloseTag(name: string) {
      this.$emit("close", name);
    },
  },
});
</script>
