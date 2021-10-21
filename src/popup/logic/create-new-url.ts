import { FeatureFlag } from "@/popup/model/model";
import { collectFeatureFlags } from "@/popup/logic/collect-feature-flags";

export function createNewUrl(
  currentUrlString: string,
  newFeatureFlags: FeatureFlag[]
): URL | null {
  const url = createUrl(currentUrlString);
  if (url === null) {
    return null;
  }
  const currentFeatureFlags = collectFeatureFlags(url.searchParams);
  for (const currentFeatureFlag of currentFeatureFlags) {
    const flag = newFeatureFlags.find(
      (flag) => flag.parameter === currentFeatureFlag.parameter
    );
    if (!flag || !flag.isActive) {
      url.searchParams.delete(currentFeatureFlag.parameter);
    }
  }

  for (const featureFlag of newFeatureFlags.filter((flag) => flag.isActive)) {
    url.searchParams.set(featureFlag.parameter, "1");
  }
  url.searchParams.sort();
  return url;
}

const createUrl = (currentUrlString: string): URL | null => {
  try {
    return new URL(currentUrlString);
  } catch (e) {
    return null;
  }
};
