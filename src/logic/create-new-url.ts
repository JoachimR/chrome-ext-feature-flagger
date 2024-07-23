import type { FeatureFlag } from '../model/model.ts'
import { collectFeatureFlags } from './collect-feature-flags.ts'

export function createNewUrl(
	currentUrlString: string,
	flags: FeatureFlag[],
): URL | null {
	const activeFlags = new Set(
		flags.filter((flag) => flag.isActive).map((flag) => flag.parameter),
	)
	const url = createUrl(currentUrlString)
	if (url === null) {
		return null
	}
	for (const current of collectFeatureFlags(url.searchParams)) {
		const has = activeFlags.has(current.parameter)
		if (!has) {
			url.searchParams.delete(current.parameter)
		}
	}
	for (const activeFlag of activeFlags) {
		url.searchParams.set(activeFlag, '1')
	}
	url.searchParams.sort()
	return url
}

const createUrl = (currentUrlString: string): URL | null => {
	try {
		return new URL(currentUrlString)
	} catch (e) {
		return null
	}
}
