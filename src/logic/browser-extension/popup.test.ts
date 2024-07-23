import { describe, expect, it, vitest } from 'vitest'
import { closePopup } from './popup.ts'

describe('popup', () => {
	it('closes the window when close is called', () => {
		const closeMock = vitest.fn()

		closePopup({ close: closeMock })

		expect(closeMock).toHaveBeenCalled()
	})
})
