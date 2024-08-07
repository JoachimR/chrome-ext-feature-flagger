import { describe, expect, it } from 'vitest'
import type { FeatureFlag } from '../model/model.ts'
import { collectFeatureFlags } from './collect-feature-flags.ts'

describe('collect-feature-flags', () => {
	const scenarios: [string, FeatureFlag[]][] = [
		['', []],
		['abc=', []],
		['?abc=', []],
		['?abc=hello', []],
		['?abc=1', [{ parameter: 'abc', isActive: true }]],
		['?abc=0', [{ parameter: 'abc', isActive: false }]],
		['?abc=1&def=hello', [{ parameter: 'abc', isActive: true }]],
		['?abc=0&def=hello', [{ parameter: 'abc', isActive: false }]],
		['?abc=1&abc=hello', [{ parameter: 'abc', isActive: true }]],
		['?abc=0&abc=hello', [{ parameter: 'abc', isActive: false }]],
		['?abc=1&abc=0', [{ parameter: 'abc', isActive: true }]],
		['?abc=0&abc=1', [{ parameter: 'abc', isActive: false }]],
		[
			'?abc=1&def=1',
			[
				{ parameter: 'abc', isActive: true },
				{ parameter: 'def', isActive: true },
			],
		],
		[
			'?abc=1&def=0',
			[
				{ parameter: 'abc', isActive: true },
				{ parameter: 'def', isActive: false },
			],
		],
		[
			'?abc=0&def=1',
			[
				{ parameter: 'abc', isActive: false },
				{ parameter: 'def', isActive: true },
			],
		],
		[
			'?abc=0&def=0',
			[
				{ parameter: 'abc', isActive: false },
				{ parameter: 'def', isActive: false },
			],
		],
	]

	it.each(scenarios)(
		'https://foo.bar%s',
		(search: string, expected: FeatureFlag[]) => {
			expect(
				collectFeatureFlags(new URL(`https://foo.bar${search}`).searchParams),
			).toEqual(expected)
		},
	)
})
