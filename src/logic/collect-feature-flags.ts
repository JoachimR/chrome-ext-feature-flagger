import { FeatureFlag, FeatureFlags } from "@/model";

export function collectFeatureFlags(url: string): FeatureFlags {
  if (!url) {
    return [];
  }
  const featureFlags: FeatureFlags = [];
  const urlParams = new URL(url).searchParams;
  const keys = new Set(urlParams.keys());
  for (const key of keys) {
    const featureFlag = findFeatureFlag(key, urlParams.get(key));
    if (featureFlag !== undefined) {
      featureFlags.push(featureFlag);
    }
  }
  return featureFlags;
}

const findFeatureFlag = (
  key: string,
  value: string | null
): FeatureFlag | undefined => {
  if (key) {
    if (isActiveFlagValue(value)) {
      return [key, true];
    }
    if (isInactiveFlagValue(value)) {
      return [key, false];
    }
  }
  return undefined;
};

const isActiveFlagValue = (value: string | null): boolean =>
  value === "1" || value === "true";
const isInactiveFlagValue = (value: string | null): boolean =>
  value === "0" || value === "false";
