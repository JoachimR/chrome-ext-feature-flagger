import { StoreToStorageFn } from "@/chrome/storage/model";

export const storeToChromeStorage: StoreToStorageFn = items => chrome.storage.sync.set(items);
