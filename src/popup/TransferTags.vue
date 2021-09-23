<template>
  <div class="display-flex flex-direction-column">
    <draggable
      class="height-50 overflow-auto border-bottom padding-4px"
      v-model="group1"
      group="tags"
      :sort="false"
    >
      <Tag
        v-for="element in group1"
        :key="element.id"
        :name="element.name"
        :active="false"
      />
    </draggable>
    <draggable
      class="height-50 overflow-auto padding-4px"
      v-model="group2"
      group="tags"
      :sort="false"
    >
      <Tag
        v-for="element in group2"
        :key="element.id"
        :name="element.name"
        :active="true"
      />
    </draggable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
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
      type: Object as TagItem[],
    },
  },
  emits: ["update"],
  setup(props) {
    const group1 = ref<TagItem[]>([]);
    const group2 = ref<TagItem[]>([]);
    const onNewItems = () => {
      group1.value = props.items.filter(
        (item: TagItem) => item.group === TagItemGroup.Group1
      );
      group2.value = props.items.filter(
        (item: TagItem) => item.group === TagItemGroup.Group2
      );
    };
    return {
      group1,
      group2,
      onNewItems,
    };
  },
  watch: {
    items: "onNewItems",
    currentItems: "onCurrentItemsChanged",
  },
  methods: {
    onCurrentItemsChanged(value: TagItem[]) {
      this.$emit("update", value);
    },
  },
  computed: {
    currentItems: {
      get(): TagItem[] {
        return [
          ...this.group1.map((item) => ({
            ...item,
            group: TagItemGroup.Group1,
          })),
          ...this.group2.map((item) => ({
            ...item,
            group: TagItemGroup.Group2,
          })),
        ].sort(sortByName);
      },
    },
  },
  mounted() {
    this.onNewItems();
  },
});
</script>
<style scoped>
.height-50 {
  height: 50%;
}
</style>
