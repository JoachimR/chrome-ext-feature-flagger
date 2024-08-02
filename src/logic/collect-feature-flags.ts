import type { FeatureFlag } from '../model/model.ts'

export function collectFeatureFlags(
	searchParams: URLSearchParams,
): FeatureFlag[] {
	const featureFlags: FeatureFlag[] = []
	const keys = new Set(searchParams.keys())
	for (const key of keys) {
		const value = searchParams.get(key)
		const featureFlag = findFeatureFlag(key, value)
		if (featureFlag !== undefined) {
			featureFlags.push(featureFlag)
		}
	}
	return featureFlags
}

const findFeatureFlag = (
	key: string,
	value: string | null,
): FeatureFlag | undefined => {
	if (key) {
		if (isActiveFlagValue(value)) {
			return { parameter: key, isActive: true }
		}
		if (isInactiveFlagValue(value)) {
			return { parameter: key, isActive: false }
		}
	}
	return undefined
}

const isActiveFlagValue = (value: string | null): boolean =>
	value === '1' || value === 'true'
const isInactiveFlagValue = (value: string | null): boolean =>
	value === '0' || value === 'false'
