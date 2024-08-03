export type FeatureFlag = {
	parameter: string
	isActive: boolean
}

export const createInactiveFeatureFlag = (parameter: string): FeatureFlag => ({
	parameter,
	isActive: false,
})

export const createActiveFeatureFlag = (parameter: string): FeatureFlag => ({
	parameter,
	isActive: true,
})

export function isFeatureFlag(thing: unknown): thing is FeatureFlag {
	return (
		typeof thing === 'object' &&
		thing !== null &&
		'parameter' in thing &&
		typeof thing.parameter === 'string' &&
		'isActive' in thing &&
		typeof thing.isActive === 'boolean'
	)
}
