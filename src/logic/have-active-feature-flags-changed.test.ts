import { describe, expect, it } from 'vitest'
import type { FeatureFlag } from '../model/model.ts'
import { haveActiveFeatureFlagsChanged } from './have-active-feature-flags-changed.ts'

describe('haveActiveFeatureFlagsChanged', () => {
	it.each([
		[[], [], false],
		[
			[{ parameter: 'abc', isActive: true }],
			[{ parameter: 'abc', isActive: true }],
			false,
		],
		[
			[{ parameter: 'abc', isActive: false }],
			[{ parameter: 'abc', isActive: false }],
			false,
		],
		[
			[{ parameter: 'abc', isActive: false }],
			[{ parameter: 'abc', isActive: true }],
			true,
		],
		[
			[{ parameter: 'abc', isActive: true }],
			[{ parameter: 'abc', isActive: false }],
			true,
		],
		[
			[{ parameter: 'abc', isActive: true }],
			[{ parameter: 'def', isActive: true }],
			true,
		],
		[
			[{ parameter: 'abc', isActive: false }],
			[{ parameter: 'def', isActive: false }],
			true,
		],
		[
			[
				{ parameter: 'abc', isActive: true },
				{ parameter: 'def', isActive: true },
			],
			[
				{ parameter: 'def', isActive: true },
				{ parameter: 'abc', isActive: true },
			],
			false,
		],
		[
			[{ parameter: 'abc', isActive: true }],
			[
				{ parameter: 'abc', isActive: true },
				{ parameter: 'def', isActive: true },
			],
			true,
		],
		[
			[{ parameter: 'abc', isActive: true }],
			[
				{ parameter: 'abc', isActive: true },
				{ parameter: 'def', isActive: false },
			],
			true,
		],
		[[{ parameter: 'abc', isActive: false }], [], true],
	])(
		'%j ==> %j ==> %s',
		(
			oldFFs: FeatureFlag[],
			newFFs: FeatureFlag[],
			expectHasChanged: boolean,
		) => {
			expect(
				haveActiveFeatureFlagsChanged({
					oldFFs: oldFFs,
					newFFs: newFFs,
				}),
			).toBe(expectHasChanged)
		},
	)
})
