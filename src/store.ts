import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { storeFeatureFlags } from './logic/browser-extension/storage.ts'
import { collectFeatureFlags } from './logic/collect-feature-flags.ts'
import { createNewUrlWithActiveFlags } from './logic/create-new-url-with-active-flags.ts'
import { haveActiveFeatureFlagsChanged } from './logic/have-active-feature-flags-changed.ts'
import {
	type FeatureFlag,
	createActiveFeatureFlag,
	createInactiveFeatureFlag,
} from './model/model.ts'

type UrlInfo = {
	url: string
	hostname: string
	featureFlags: string[]
}

const removeFromList = (list: string[], value: string) => {
	const index = list.indexOf(value)
	if (index > -1) {
		list.splice(index, 1)
	}
}
const addToList = (list: string[], value: string) => {
	if (!list.includes(value)) {
		list.push(value)
	}
}

export const useStore = defineStore('store', () => {
	const initialized = ref(false)

	const urlInfo = ref<UrlInfo>({
		url: '',
		hostname: '',
		featureFlags: [],
	})

	const ffOff = ref<string[]>([])
	const ffOn = ref<string[]>([])

	const updateLocalStorage = (flags: FeatureFlag[]) => {
		if (initialized.value && urlInfo.value.hostname) {
			storeFeatureFlags(urlInfo.value.hostname, flags)
		}
	}

	const featureFlags = computed<FeatureFlag[]>(() => [
		...ffOff.value.map(createInactiveFeatureFlag),
		...ffOn.value.map(createActiveFeatureFlag),
	])

	watch(
		() => featureFlags,
		() => {
			updateLocalStorage(featureFlags.value)
		},
		{ deep: true },
	)

	function reset(
		payload:
			| {
					type: 'valid'
					value: {
						urlInfo: UrlInfo
						flags: { off: Set<string>; on: Set<string> }
					}
			  }
			| { type: 'invalid' },
	) {
		if (payload.type === 'invalid') {
			urlInfo.value = { url: '', hostname: '', featureFlags: [] }
			ffOff.value = []
			ffOn.value = []
			initialized.value = false
		} else {
			urlInfo.value = payload.value.urlInfo
			ffOff.value = Array.from(payload.value.flags.off)
			ffOn.value = Array.from(payload.value.flags.on)
			initialized.value = true
		}
	}

	function removeFeatureFlag(name: string) {
		removeFromList(ffOff.value, name)
		removeFromList(ffOn.value, name)
	}
	function addFeatureFlag(name: string) {
		removeFromList(ffOff.value, name)
		addToList(ffOn.value, name)
	}

	const isInitialized = computed(() => initialized.value)
	const hasChanges = computed(() => {
		const original = urlInfo.value.featureFlags.map(createActiveFeatureFlag)
		const current = ffOn.value.map(createActiveFeatureFlag)
		return haveActiveFeatureFlagsChanged(original, current)
	})

	const newUrl = computed<URL | null>(() => {
		const url = urlInfo.value.url
		if (!url) {
			return null
		}
		return createNewUrlWithActiveFlags(url, ffOn.value)
	})

	return {
		ffOff,
		ffOn,
		reset,
		removeFeatureFlag,
		addFeatureFlag,
		isInitialized,
		hasChanges,
		newUrl,
	}
})

const extractValidUrl = (
	url: string | undefined,
): { hostname: string; searchParams: URLSearchParams } | undefined => {
	const urlString = url ?? ''
	if (urlString) {
		const url = new URL(urlString)
		const hostname = url.hostname
		if (hostname) {
			return { hostname, searchParams: url.searchParams }
		}
	}
	return undefined
}

export const resetStore = (
	store: ReturnType<typeof useStore>,
	payload: { url: string; featureFlagsStored: FeatureFlag[] },
): void => {
	const validUrl = extractValidUrl(payload.url)
	if (!validUrl) {
		store.reset({ type: 'invalid' })
		return
	}

	const featureFlagsFromUrl = collectFeatureFlags(validUrl.searchParams)
		.filter((flag) => flag.isActive)
		.map((flag) => flag.parameter)

	const urlInfo = {
		url: payload.url,
		hostname: validUrl.hostname,
		featureFlags: featureFlagsFromUrl,
	}

	const flags = {
		off: new Set<string>(),
		on: new Set<string>(),
	}

	for (const flag of payload.featureFlagsStored) {
		if (flag.isActive) {
			flags.on.add(flag.parameter)
		} else {
			flags.off.add(flag.parameter)
		}
	}
	for (const param of featureFlagsFromUrl) {
		flags.off.delete(param)
		flags.on.add(param)
	}

	store.reset({ type: 'valid', value: { urlInfo, flags } })
}
