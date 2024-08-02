import { describe, expect, it } from 'vitest'
import { createNewUrl } from './create-new-url.ts'

describe('createNewUrl', () => {
	const scenarios: {
		url: string
		on: string[]
		off: string[]
		expected: string | undefined
	}[] = [
		{
			url: '',
			on: [],
			off: [],
			expected: undefined,
		},
		{
			url: 'https://foo.bar/?a=1&b=0&c=1&d=something',
			on: ['a'],
			off: [],
			expected: 'https://foo.bar/?a=1&d=something',
		},
		{
			url: 'https://foo.bar/?a=1&b=0&c=1&d=something',
			on: ['a', 'b'],
			off: [],
			expected: 'https://foo.bar/?a=1&b=1&d=something',
		},
		{
			url: 'https://foo.bar/?a=1&b=0&c=1&d=something',
			on: [],
			off: ['b'],
			expected: 'https://foo.bar/?b=0&d=something',
		},
		{
			url: 'https://foo.bar/?a=1&b=0&c=1&d=something',
			on: [],
			off: ['a', 'c'],
			expected: 'https://foo.bar/?a=0&c=0&d=something',
		},
		{
			url: 'https://foo.bar/?a=1&b=0&c=1&d=something',
			on: ['e'],
			off: [],
			expected: 'https://foo.bar/?d=something&e=1',
		},
		{
			url: 'https://foo.bar/?a=1&b=0&c=1&d=something',
			on: [],
			off: ['e'],
			expected: 'https://foo.bar/?d=something&e=0',
		},
		{
			url: 'https://foo.bar/?a=1&b=0&c=1&d=something',
			on: ['a'],
			off: ['b'],
			expected: 'https://foo.bar/?a=1&b=0&d=something',
		},
	]

	it.each(scenarios)(
		'%j',
		({
			url,
			on,
			off,
			expected,
		}: {
			url: string
			on: string[]
			off: string[]
			expected: string | undefined
		}) => {
			expect(
				createNewUrl({
					currentUrlString: url,
					flagsOn: on,
					flagsOff: off,
				})?.toString(),
			).toEqual(expected)
		},
	)
})
