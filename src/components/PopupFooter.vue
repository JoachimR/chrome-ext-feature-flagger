<template>
  <div>
    <div class="display-flex padding-horizontal-4px align-items-center">
      <div class="flex-1">
        <it-input v-model="newParam" placeholder="Add new feature flag" class="flex-1" @keyup.enter="onAdd" />
      </div>
      <div class="margin-4px">
        <it-button icon="add" :disabled="!newParam" @click="onAdd" />
      </div>
    </div>
    <div class="display-flex padding-horizontal-4px align-items-center">
      <div class="flex-1">
        <it-input :model-value="newDisplayedUrl" readonly />
      </div>
      <div class="margin-4px">
        <it-button icon="refresh" :disabled="!store.hasChanges" @click="onSubmit" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { closePopup } from '../logic/browser-extension/popup.ts'
import { reloadTabWithUrl } from '../logic/browser-extension/tabs.ts'
import { useStore } from '../store.ts'

const store = useStore()

const onSubmit = async () => {
	const url = store.newUrl
	if (url !== null) {
		await reloadTabWithUrl(url)
		closePopup()
	}
}

const newParam = ref<string>('')

const newDisplayedUrl = computed(() => {
	let strings = (store.newUrl?.toString() || '').split('?')
	const base = strings[0]
	const query = strings[1]
	let baseEllipsis = base
	if (base.length > 15) {
		baseEllipsis = `${base.substring(0, 15)}...`
	}
	return `${baseEllipsis}?${query}`
})

const onAdd = () => {
	const param = newParam.value.trim()
	if (param) {
		const value = param.substring(0, 99)
		store.addFeatureFlag(value)
		newParam.value = ''
	}
}
</script>
