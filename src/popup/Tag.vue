<template>
  <w-tag class="margin-2px" outline :color="bgcolor">
    <span class="hover-grab padding-right-8px">{{ name }}</span>

    <w-button
      :bg-color="bgcolor"
      :color="color"
      icon="mdi mdi-close"
      @click="onClose"
      sm
    />
  </w-tag>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

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
    const bgcolor = computed<string>(() => {
      return props.active ? "primary" : "grey-light2";
    });
    const color = computed<string>(() => {
      return props.active ? "#fff" : "primary";
    });

    const onClose = () => {
      context.emit("close", props.name);
    };

    return { bgcolor, color, onClose };
  },
});
</script>
<style scoped>
.hover-grab:hover {
  cursor: grab;
}
</style>
