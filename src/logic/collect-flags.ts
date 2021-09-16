import { FeatureFlag } from "@/model/feature-flag";

export function collectFlags(url: string): FeatureFlag[] {
  if (!url) {
    return [];
  }
  const featureFlags: FeatureFlag[] = [];
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
      return {
        parameter: key,
        active: true,
      };
    }
    if (isInactiveFlagValue(value)) {
      return {
        parameter: key,
        active: false,
      };
    }
  }
  return undefined;
};

const isActiveFlagValue = (value: string | null): boolean =>
  value === "1" || value === "true";
const isInactiveFlagValue = (value: string | null): boolean =>
  value === "0" || value === "false";
