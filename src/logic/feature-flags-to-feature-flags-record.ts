import { FeatureFlags, FeatureFlagsRecord } from "@/model";

export function featureFlagsToFeatureFlagsRecord(
  featureFlags: FeatureFlags
): FeatureFlagsRecord {
  const record: FeatureFlagsRecord = {};
  for (const featureFlag of featureFlags) {
    const key = featureFlag[0];
    if (!record[key]) {
      record[key] = featureFlag[1];
    }
  }
  return record;
}
