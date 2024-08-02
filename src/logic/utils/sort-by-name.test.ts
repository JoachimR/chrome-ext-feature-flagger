import { describe, expect, it } from 'vitest'
import { sortByName } from './sort-by-name.ts'

describe('sortByName', () => {
	it.each([
		[[], []],
		[
			['x', 'y'],
			['x', 'y'],
		],
		[
			['y', 'x'],
			['x', 'y'],
		],
		[
			['y', 'z', 'x'],
			['x', 'y', 'z'],
		],
		[
			['2', '3', '1'],
			['1', '2', '3'],
		],
	])('%j ==> %j ==> %s', (arr: string[], expected: string[]) => {
		const actual = arr.sort((a: string, b: string) => sortByName(a, b))
		expect(actual).toEqual(expected)
	})
})
