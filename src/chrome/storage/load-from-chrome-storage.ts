import { LoadFromStorageFn } from "@/chrome/storage/model";

export const loadFromChromeStorage: LoadFromStorageFn = (hostname, callback) => chrome.storage.sync.get([hostname], items => callback(items));
