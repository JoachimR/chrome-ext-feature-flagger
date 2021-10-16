/// <reference types="chrome"/>

import { FeatureFlag, isFeatureFlag } from "@/popup/model";
import { sortByName } from "@/logic/sort-by-name";

export type LoadFromStorageFn = (
  hostname: string,
  callback: (result: { [hostname: string]: unknown }) => void
) => void;

const keyForUrl = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch (ignored) {
    return null;
  }
};

const retrieveFlags = (key: string, result: { [key: string]: unknown }) => {
  const values = result[key] ?? [];
  if (Array.isArray(values)) {
    return values.filter(isFeatureFlag);
  }
  return [];
};

export function loadStoredFeatureFlags(
  url: string,
  onLoaded: (result: FeatureFlag[]) => void,
  loadFromStorageFn: LoadFromStorageFn = chrome.storage.sync.get
): void {
  const key = keyForUrl(url);
  if (key === null) {
    onLoaded([]);
    return;
  }

  loadFromStorageFn(key, (result: { [key: string]: unknown }) => {
    const flags = retrieveFlags(key, result);
    flags.sort((a: FeatureFlag, b: FeatureFlag) =>
      sortByName(a.parameter, b.parameter)
    );
    onLoaded(flags);
  });
}

export type StoreToStorageFn = (items: {
  [hostname: string]: FeatureFlag[];
}) => Promise<void>;

export function storeFeatureFlags(
  hostname: string,
  featureFlags: FeatureFlag[],
  storeToStorageFn: StoreToStorageFn = chrome.storage.sync.set
): Promise<void> {
  if (!hostname) {
    return Promise.resolve();
  }
  return storeToStorageFn({ [hostname]: featureFlags });
}
