/// <reference types="chrome"/>

import type { ChromeAPI } from './chrome-api.ts'

export const chromeAPIImplementation: ChromeAPI = {
	tabs: {
		update: (updateProperties) => chrome.tabs.update(updateProperties),
		addUpdatedListener: (callback) =>
			chrome.tabs.onUpdated.addListener(callback),
		query: (callback) =>
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
				callback(tabs),
			),
	},
	message: {
		send: (message: unknown) => chrome.runtime.sendMessage(message),
		addListener: (callback) => chrome.runtime.onMessage.addListener(callback),
	},
	storage: {
		get: (
			key: string,
			callback: (items: { [key: string]: unknown }) => void,
		) => {
			chrome.storage.sync.get([key], (items) => callback(items))
		},
		set: (items: { [key: string]: unknown }) => {
			return chrome.storage.sync.set(items)
		},
	},
}
