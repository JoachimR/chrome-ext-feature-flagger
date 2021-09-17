
import { collectFeatureFlags } from "@/logic/collect-feature-flags";
import { FeatureFlags, FeatureFlagsRecord } from "@/model";

export function collectFeatureFlagsRecord(url: string): FeatureFlagsRecord {
  const record: FeatureFlagsRecord = {};
  const featureFlags: FeatureFlags = collectFeatureFlags(url);
  for (const featureFlag of featureFlags) {
    const key = featureFlag[0];
    if (!record[key]) {
      record[key] = featureFlag[1];
    }
  }
  return record;
}
