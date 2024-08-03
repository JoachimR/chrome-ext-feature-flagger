import { collectFeatureFlags } from './collect-feature-flags.ts'

export function createNewUrl({
	currentUrlString,
	flagsOn,
	flagsOff,
}: {
	currentUrlString: string
	flagsOn: string[]
	flagsOff: string[]
}): URL | null {
	const inactiveFlags = new Set(flagsOff)
	const activeFlags = new Set(flagsOn)

	const url = createUrl(currentUrlString)
	if (url === null) {
		return null
	}

	// delete all flags that are not off or on anymore
	for (const current of collectFeatureFlags(url.searchParams)) {
		if (
			!activeFlags.has(current.parameter) &&
			!inactiveFlags.has(current.parameter)
		) {
			url.searchParams.delete(current.parameter)
		}
	}

	for (const f of inactiveFlags) {
		url.searchParams.set(f, '0')
	}
	for (const f of activeFlags) {
		url.searchParams.set(f, '1')
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
