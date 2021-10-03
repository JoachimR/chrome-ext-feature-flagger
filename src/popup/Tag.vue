<template>
  <va-chip
    closeable
    v-model="show"
    outline
    square
    :color="type"
    class="hover-grab"
  >
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
  emits: ["close"],
  props: {
    name: {
      type: String,
    },
    active: {
      type: Boolean,
    },
  },
  setup(props, context) {
    const type = computed<TagType>(() => {
      return props.active ? TagType.active : TagType.inactive;
    });

    const show = computed<boolean>({
      get: (): boolean => true,
      set: (newValue: boolean) => {
        if (!newValue) {
          context.emit("close", props.name);
        }
      },
    });
    return { type, show };
  },
});
</script>
<style scoped>
.hover-grab:hover {
  cursor: grab;
}
</style>
