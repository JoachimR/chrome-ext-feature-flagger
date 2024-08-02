import { describe, expect, it } from 'vitest'
import type { FeatureFlag } from '../model/model.ts'
import { createNewUrl } from './create-new-url.ts'

describe('createNewUrl', () => {
	const scenarios: [string, FeatureFlag[], string | undefined][] = [
		['', [], undefined],
		[
			'https://foo.bar/?a=1&b=0&c=1',
			[{ parameter: 'a', isActive: true }],
			'https://foo.bar/?a=1',
		],
		[
			'https://foo.bar/?a=1&b=0&c=1',
			[{ parameter: 'a', isActive: false }],
			'https://foo.bar/',
		],
		[
			'https://foo.bar/?a=1&b=0&c=1',
			[{ parameter: 'c', isActive: true }],
			'https://foo.bar/?c=1',
		],
		[
			'https://foo.bar/?a=1&b=0&c=1',
			[
				{ parameter: 'c', isActive: true },
				{ parameter: 'b', isActive: true },
			],
			'https://foo.bar/?b=1&c=1',
		],
	]

	it.each(scenarios)(
		'%s => %o => %s',
		(
			currentUrlString: string,
			newFeatureFlags: FeatureFlag[],
			expected: string | undefined,
		) => {
			const actual = createNewUrl(currentUrlString, newFeatureFlags)
			expect(actual?.toString()).toEqual(expected)
		},
	)
})
