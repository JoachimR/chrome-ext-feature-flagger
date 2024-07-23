import { type FeatureFlag, isFeatureFlag } from '../../model/model.ts'
import { sortByName } from '../utils/sort-by-name.ts'
import { chromeAPIImplementation } from './chrome/chrome-api-implementation.ts'
import type { ChromeAPI } from './chrome/chrome-api.ts'

const keyForUrl = (url: string) => {
	try {
		return new URL(url).hostname
	} catch (ignored) {
		return null
	}
}

const retrieveFlags = (key: string, result: { [key: string]: unknown }) => {
	const values = result[key] ?? []
	if (Array.isArray(values)) {
		return values.filter(isFeatureFlag)
	}
	return []
}

export function loadStoredFeatureFlags(
	url: string,
	onLoaded: (result: FeatureFlag[]) => void,
	chromeAPI: ChromeAPI = chromeAPIImplementation,
): void {
	const key = keyForUrl(url)
	if (key === null) {
		onLoaded([])
		return
	}

	chromeAPI.storage.get(key, (result: { [key: string]: unknown }) => {
		const flags = retrieveFlags(key, result)
		flags.sort((a: FeatureFlag, b: FeatureFlag) =>
			sortByName(a.parameter, b.parameter),
		)
		onLoaded(flags)
	})
}

export function storeFeatureFlags(
	hostname: string,
	featureFlags: FeatureFlag[],
	chromeAPI: ChromeAPI = chromeAPIImplementation,
): Promise<void> {
	if (!hostname) {
		return Promise.resolve()
	}
	return chromeAPI.storage.set({ [hostname]: featureFlags })
}
