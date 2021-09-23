<template>
  <el-tag class="hover-grab margin-4px" :type="type"> {{ name }} </el-tag>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

enum TagType {
  inactive = "danger",
  active = "success",
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
