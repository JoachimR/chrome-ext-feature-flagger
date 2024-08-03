import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { storeFeatureFlags } from './logic/browser-extension/storage.ts'
import { collectFeatureFlags } from './logic/collect-feature-flags.ts'
import { createNewUrl } from './logic/create-new-url.ts'
import { haveActiveFeatureFlagsChanged } from './logic/have-active-feature-flags-changed.ts'
import {
	type FeatureFlag,
	createActiveFeatureFlag,
	createInactiveFeatureFlag,
} from './model/model.ts'

type UrlInfo = {
	url: string
	hostname: string
	flags: {
		off: string[]
		on: string[]
	}
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
		flags: {
			off: [],
			on: [],
		},
	})

	const ffShelf = ref<string[]>([])
	const ffOff = ref<string[]>([])
	const ffOn = ref<string[]>([])

	const updateLocalStorage = ({
		off,
		on,
	}: {
		off: Set<string>
		on: Set<string>
	}) => {
		if (initialized.value && urlInfo.value.hostname) {
			const flags = [
				...Array.from(off).map(createInactiveFeatureFlag),
				...Array.from(on).map(createActiveFeatureFlag),
			]
			storeFeatureFlags(urlInfo.value.hostname, flags)
		}
	}

	const featureFlagsToStore = computed<{ off: Set<string>; on: Set<string> }>(
		() => ({
			off: new Set([...ffShelf.value, ...ffOff.value]),
			on: new Set(ffOn.value),
		}),
	)

	watch(
		() => featureFlagsToStore,
		() => {
			updateLocalStorage(featureFlagsToStore.value)
		},
		{ deep: true },
	)

	function reset(
		payload:
			| {
					type: 'valid'
					value: {
						urlInfo: UrlInfo
						flags: {
							shelf: Set<string>
							off: Set<string>
							on: Set<string>
						}
					}
			  }
			| { type: 'invalid' },
	) {
		if (payload.type === 'invalid') {
			urlInfo.value = {
				url: '',
				hostname: '',
				flags: {
					off: [],
					on: [],
				},
			}
			ffShelf.value = []
			ffOff.value = []
			ffOn.value = []
			initialized.value = false
		} else {
			urlInfo.value = payload.value.urlInfo
			ffShelf.value = Array.from(payload.value.flags.shelf)
			ffOff.value = Array.from(payload.value.flags.off)
			ffOn.value = Array.from(payload.value.flags.on)
			initialized.value = true
		}
	}

	function deleteFeatureFlag(name: string) {
		removeFromList(ffShelf.value, name)
		removeFromList(ffOff.value, name)
		removeFromList(ffOn.value, name)
	}
	function addFeatureFlag(name: string) {
		removeFromList(ffShelf.value, name)
		removeFromList(ffOff.value, name)
		addToList(ffOn.value, name)
	}

	const isInitialized = computed(() => initialized.value)
	const hasChanges = computed(() =>
		haveActiveFeatureFlagsChanged({
			oldFFs: urlInfo.value.flags.on
				.map(createActiveFeatureFlag)
				.concat(urlInfo.value.flags.off.map(createInactiveFeatureFlag)),
			newFFs: ffOn.value
				.map(createActiveFeatureFlag)
				.concat(ffOff.value.map(createInactiveFeatureFlag)),
		}),
	)

	const newUrl = computed<URL | null>(() => {
		const url = urlInfo.value.url
		if (!url) {
			return null
		}
		return createNewUrl({
			currentUrlString: url,
			flagsOn: ffOn.value,
			flagsOff: ffOff.value,
		})
	})

	return {
		ffShelf,
		ffOff,
		ffOn,
		reset,
		deleteFeatureFlag,
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
	const ffOffFromUrl = featureFlagsFromUrl
		.filter((flag) => !flag.isActive)
		.map((flag) => flag.parameter)
	const ffOnFromUrl = featureFlagsFromUrl
		.filter((flag) => flag.isActive)
		.map((flag) => flag.parameter)

	const urlInfo: UrlInfo = {
		url: payload.url,
		hostname: validUrl.hostname,
		flags: {
			off: ffOffFromUrl,
			on: ffOnFromUrl,
		},
	}

	const flags = {
		shelf: new Set<string>(),
		off: new Set<string>(),
		on: new Set<string>(),
	}

	for (const flag of payload.featureFlagsStored) {
		if (flag.isActive) {
			flags.on.add(flag.parameter)
		} else {
			flags.shelf.add(flag.parameter)
		}
	}
	for (const param of ffOnFromUrl) {
		flags.shelf.delete(param)
		flags.on.add(param)
	}
	for (const param of ffOffFromUrl) {
		flags.shelf.delete(param)
		flags.off.add(param)
	}

	store.reset({ type: 'valid', value: { urlInfo, flags } })
}
