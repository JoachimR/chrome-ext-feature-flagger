import { FeatureFlag, FeatureFlags } from "@/model";

export function collectFeatureFlags(
  searchParams: URLSearchParams
): FeatureFlags {
  const featureFlags: FeatureFlags = [];
  const keys = new Set(searchParams.keys());
  for (const key of keys) {
    const featureFlag = findFeatureFlag(key, searchParams.get(key));
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
