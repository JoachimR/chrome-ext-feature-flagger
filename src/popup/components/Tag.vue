<template>
  <div class="margin-vertical-4px">
    <w-tag class="hover-grab" outline :color="bgcolor">
      <span class="padding-right-16px">{{ name }}</span>
      <w-button
        data-testid="close"
        :aria-label="close"
        :bg-color="bgcolor"
        :color="color"
        icon="mdi mdi-close"
        @click="onClose"
        sm
      />
    </w-tag>
  </div>
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
      return props.active ? "white" : "grey-dark4";
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
