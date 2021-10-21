import { FeatureFlag, isFeatureFlag } from "@/popup/model/model";
import { sortByName } from "@/popup/logic/utils/sort-by-name";
import { ChromeAPI } from "@/popup/logic/browser-extension/chrome/chrome-api";
import { chromeAPIImplementation } from "@/popup/logic/browser-extension/chrome/chrome-api-implementation";

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
  chromeAPI: ChromeAPI = chromeAPIImplementation
): void {
  const key = keyForUrl(url);
  if (key === null) {
    onLoaded([]);
    return;
  }

  chromeAPI.storage.get(key, (result: { [key: string]: unknown }) => {
    const flags = retrieveFlags(key, result);
    flags.sort((a: FeatureFlag, b: FeatureFlag) =>
      sortByName(a.parameter, b.parameter)
    );
    onLoaded(flags);
  });
}

export function storeFeatureFlags(
  hostname: string,
  featureFlags: FeatureFlag[],
  chromeAPI: ChromeAPI = chromeAPIImplementation
): Promise<void> {
  if (!hostname) {
    return Promise.resolve();
  }
  return chromeAPI.storage.set({ [hostname]: featureFlags });
}
