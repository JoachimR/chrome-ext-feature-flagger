<template>
  <div class="margin-vertical-4px">
    <it-tag class="hover-grab" :type="type" closable filled @close="onClose">
      {{ name }}
    </it-tag>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineEmits, defineProps } from 'vue'

const props = defineProps<{
	name: string
	active: boolean
}>()

const type = computed<string>(() => (props.active ? 'primary' : ''))

const emit = defineEmits<(e: 'close', name: string) => void>()

const onClose = () => {
	emit('close', props.name)
}
</script>
<style scoped>
.hover-grab:hover {
  cursor: grab;
}
</style>
