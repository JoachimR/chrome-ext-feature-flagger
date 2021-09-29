<template>
  <va-chip outline square closeable :color="type" class="hover-grab">
    {{ name }}
  </va-chip>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

enum TagType {
  inactive = "#ef476f",
  active = "#2C82E0",
}

export default defineComponent({
  name: "Tag",
  props: {
    name: {
      type: String,
    },
    active: {
      type: Boolean,
    },
  },
  setup(props) {
    const type = computed<TagType>(() => {
      return props.active ? TagType.active : TagType.inactive;
    });
    return { type };
  },
});
</script>
<style scoped>
.hover-grab:hover {
  cursor: grab;
}
</style>
