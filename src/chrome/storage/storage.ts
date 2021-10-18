/// <reference types="chrome"/>

import { FeatureFlag, isFeatureFlag } from "@/popup/model";
import { sortByName } from "@/logic/sort-by-name";
import { loadFromChromeStorage } from "@/chrome/storage/load-from-chrome-storage";
import { LoadFromStorageFn, StoreToStorageFn } from "@/chrome/storage/model";
import { storeToChromeStorage } from "@/chrome/storage/store-to-chrome-storage";

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

export const loadStoredFeatureFlags = (
  url: string,
  onLoaded: (result: FeatureFlag[]) => void,
  loadFromStorageFn: LoadFromStorageFn = loadFromChromeStorage
): void => {
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
};

export const storeFeatureFlags = (
  hostname: string,
  featureFlags: FeatureFlag[],
  storeToStorageFn: StoreToStorageFn = storeToChromeStorage
): Promise<void> => {
  if (!hostname) {
    return Promise.resolve();
  }
  return storeToStorageFn({ [hostname]: featureFlags });
};
