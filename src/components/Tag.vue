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
	state: 'history' | 'off' | 'on'
}>()

const type = computed<string>(() => {
	if (props.state === 'off') {
		return 'danger'
	}
	if (props.state === 'on') {
		return 'primary'
	}
	return 'default'
})

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
