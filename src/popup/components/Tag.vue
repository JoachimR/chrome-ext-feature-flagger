<template>
  <div class="margin-vertical-4px">
    <it-tag class="hover-grab" :type="type" closable filled @close="onClose">
      {{ name }}
    </it-tag>
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
    const type = computed<string>(() => {
      return props.active ? "primary" : "";
    });

    const onClose = () => {
      context.emit("close", props.name);
    };

    return { type, onClose };
  },
});
</script>
<style scoped>
.hover-grab:hover {
  cursor: grab;
}
</style>
