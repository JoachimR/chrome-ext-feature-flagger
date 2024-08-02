import { chromeAPIImplementation } from './chrome/chrome-api-implementation.ts'
import {
	type ChromeAPI,
	type TabId,
	unknownTabId,
} from './chrome/chrome-api.ts'

export function startListeningForUrlChange(
	chromeAPI: ChromeAPI = chromeAPIImplementation,
): void {
	chromeAPI.tabs.addUpdatedListener(
		(tabId: number, changeInfo: { url?: string | undefined }) => {
			if (changeInfo.url) {
				chromeAPI.message.send(createMessage(tabId, changeInfo.url))
			}
		},
	)
}

export async function reloadTabWithUrl(
	url: URL,
	chromeAPI: ChromeAPI = chromeAPIImplementation,
): Promise<void> {
	await chromeAPI.tabs.update({ url: url.toString() })
}

export function initPopup(
	callback: (tabId: number, url: string) => void,
	chromeAPI: ChromeAPI = chromeAPIImplementation,
): void {
	chromeAPI.tabs.query(
		(tabs: { id?: TabId | undefined; url?: string | undefined }[]) => {
			if (tabs.length > 0) {
				const tab = tabs[0]
				const tabId = tab.id ?? unknownTabId
				const url = tab.url
				if (tabId !== unknownTabId && url !== undefined) {
					callback(tabId, url)
				}
			}
		},
	)
}

export function registerListenerForUrlChange(
	callback: (tabId: number, url: string) => void,
	chromeAPI: ChromeAPI = chromeAPIImplementation,
): void {
	chromeAPI.message.addListener((message) => {
		if (isMessageUrlChanged(message)) {
			callback(message.tabId, message.url)
		}
	})
}

const messageUrlChangedType = 'URL_CHANGED'

interface MessageUrlChanged {
	type: typeof messageUrlChangedType
	tabId: number
	url: string
}

function isMessageUrlChanged(message: unknown): message is MessageUrlChanged {
	return (
		typeof message === 'object' &&
		message !== null &&
		'type' in message &&
		typeof message.type === 'string' &&
		message.type === messageUrlChangedType
	)
}

function createMessage(tabId: number, url: string): MessageUrlChanged {
	return {
		type: messageUrlChangedType,
		tabId,
		url,
	}
}
