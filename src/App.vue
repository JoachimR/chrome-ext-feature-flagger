<template>
  <w-app>
    <Popup v-if="store.isInitialized" />
  </w-app>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Popup from './components/Popup.vue'
import {
	TabId,
	unknownTabId,
} from './logic/browser-extension/chrome/chrome-api.ts'
import { loadStoredFeatureFlags } from './logic/browser-extension/storage.ts'
import {
	initPopup,
	registerListenerForUrlChange,
} from './logic/browser-extension/tabs.ts'
import { resetStore, useStore } from './store.ts'

const tabIdRef = ref<TabId>(unknownTabId)

const store = useStore()

const initForUrl = (url: string) => {
	loadStoredFeatureFlags(url, (flags) => {
		resetStore(store, { url, featureFlagsStored: flags })
	})
}

onMounted(() => {
	initPopup((tabId: number, url: string) => {
		tabIdRef.value = tabId
		initForUrl(url)
	})

	registerListenerForUrlChange((tabId: number, url: string) => {
		if (tabIdRef.value !== unknownTabId && tabIdRef.value === tabId) {
			initForUrl(url)
		}
	})
})
</script>

<style>
body {
  margin: 0;
}
.display-flex {
  display: flex;
}
.flex-direction-column {
  flex-direction: column;
}
.flex-1 {
  flex: 1;
}
.align-items-center {
  align-items: center;
}
.overflow-auto {
  overflow: auto;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.border-bottom {
  border-bottom: 1px solid #1c3967;
}
.border-right {
  border-right: 1px solid #1c3967;
}
.border-top {
  border-top: 1px solid #1c3967;
}
.margin-vertical-4px {
  margin-top: 4px;
  margin-bottom: 4px;
}
.margin-4px {
  margin: 4px;
}
.padding-right-16px {
  padding-right: 16px;
}
.padding-4px {
  padding: 4px;
}
.padding-bottom-4px {
  padding-bottom: 4px;
}
.padding-horizontal-4px {
  padding-left: 4px;
  padding-right: 4px;
}
.display-inline {
  display: inline;
}
.text-align-center {
  text-align: center;
}
</style>
