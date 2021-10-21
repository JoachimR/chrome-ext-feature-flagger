<template>
  <TransferTags
    :items="tagItems"
    @update="onTagsModified"
    @close="onCloseTag"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { FeatureFlag, TagItem, tagItemToFeatureFlag } from "@/popup/model/model";
import { featureFlagToTagItem } from "@/popup/logic/feature-flag-to-tag-item";
import TransferTags from "@/popup/components/TransferTags.vue";

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
