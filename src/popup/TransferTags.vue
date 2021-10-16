<template>
  <div class="display-flex border-bottom">
    <draggable
      class="flex-1 overflow-auto hide-scrollbar border-right padding-4px"
      v-model="group1"
      group="tags"
    >
      <Tag
        :name="element.name"
        v-for="element in group1"
        :key="element.id"
        :active="false"
        @close="onCloseTag"
      />
    </draggable>
    <draggable
      class="flex-1 overflow-auto hide-scrollbar padding-4px"
      v-model="group2"
      group="tags"
    >
      <Tag
        :name="element.name"
        v-for="element in group2"
        :key="element.id"
        :active="true"
        @close="onCloseTag"
      />
    </draggable>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRefs, watch } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import Tag from "@/popup/Tag.vue";
import { TagItem, TagItemGroup } from "@/popup/model";
import { sortByName } from "@/logic/sort-by-name";

export default defineComponent({
  components: {
    draggable: VueDraggableNext,
    Tag,
  },
  props: {
    items: {
      type: Object,
    },
  },
  emits: ["update", "close"],
  setup(props, context) {
    const items = toRefs(props).items;

    const group1 = ref<TagItem[]>([]);
    const group2 = ref<TagItem[]>([]);

    const onNewItems = () => {
      group1.value = (items.value as TagItem[]).filter(
        (item: TagItem) => item.group === TagItemGroup.Inactive
      );

      group2.value = (items.value as TagItem[]).filter(
        (item: TagItem) => item.group === TagItemGroup.Active
      );
    };

    const currentItems = computed<TagItem[]>(() =>
      [
        ...group1.value.map((item) => ({
          ...item,
          group: TagItemGroup.Inactive,
        })),
        ...group2.value.map((item) => ({
          ...item,
          group: TagItemGroup.Active,
        })),
      ].sort((a: TagItem, b: TagItem) => sortByName(a.name, b.name))
    );

    watch(
      () => currentItems,
      (value) => {
        context.emit("update", value.value);
      },
      { deep: true }
    );

    watch(
      () => items,
      () => {
        onNewItems();
      },
      { deep: true }
    );

    const onCloseTag = (name: string) => {
      context.emit("close", name);
    };

    onMounted(() => {
      onNewItems();
    });

    return {
      group1,
      group2,
      onCloseTag,
    };
  },
});
</script>
