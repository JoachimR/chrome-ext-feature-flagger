import { FeatureFlag, FeatureFlagsRecord } from "@/popup/model";

export function featureFlagsToFeatureFlagsRecord(
  featureFlags: FeatureFlag[]
): FeatureFlagsRecord {
  const record: FeatureFlagsRecord = {};
  for (const featureFlag of featureFlags) {
    const key = featureFlag.parameter;
    if (!record[key]) {
      record[key] = featureFlag;
    }
  }
  return record;
}
