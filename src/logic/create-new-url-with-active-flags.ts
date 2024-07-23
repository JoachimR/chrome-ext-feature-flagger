import type { FeatureFlag } from '../model/model.ts'
import { createNewUrl } from './create-new-url.ts'

export function createNewUrlWithActiveFlags(
	currentUrlString: string,
	flags: string[],
): URL | null {
	const activeFlags = flags.map(
		(flag) => ({ isActive: true, parameter: flag }) satisfies FeatureFlag,
	)
	return createNewUrl(currentUrlString, activeFlags)
}
