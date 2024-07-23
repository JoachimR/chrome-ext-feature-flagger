export type TabId = number
export const unknownTabId = -1

export interface ChromeAPI {
	tabs: {
		update: (updateProperties: { url: string }) => void
		addUpdatedListener: (
			callback: (
				tabId: number,
				changeInfo: { url?: string | undefined },
			) => void,
		) => void
		query: (
			callback: (
				tabs: { id?: TabId | undefined; url?: string | undefined }[],
			) => void,
		) => void
	}
	message: {
		send: (message: unknown) => void
		addListener: (callback: (message: unknown) => void) => void
	}
	storage: {
		get: (
			key: string,
			callback: (items: { [key: string]: unknown }) => void,
		) => void
		set: (items: { [key: string]: unknown }) => Promise<void>
	}
}
