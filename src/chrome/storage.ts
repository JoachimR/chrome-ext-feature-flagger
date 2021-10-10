/// <reference types="chrome"/>

import { FeatureFlag } from "@/popup/model";
import { sortByName } from "@/logic/sort-by-name";

export function loadStoredFeatureFlags(
  url: string,
  onLoaded: (result: FeatureFlag[]) => void
): void {
  const key = keyForUrl(url);
  if (key === null) {
    onLoaded([]);
    return;
  }
  chrome.storage.sync.get([key], (result: { [key: string]: any }) => {
    const flags = (result[key] ?? []) as FeatureFlag[];
    flags.sort((a: FeatureFlag, b: FeatureFlag) =>
      sortByName(a.parameter, b.parameter)
    );
    onLoaded(flags);
  });
}

export function storeFeatureFlags(
  hostname: string,
  featureFlags: FeatureFlag[]
): Promise<void> {
  if (!hostname) {
    return Promise.resolve();
  }
  return chrome.storage.sync.set({ [hostname]: featureFlags });
}

const keyForUrl = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch (ignored) {
    return null;
  }
};
