import { FeatureFlag } from "@/popup/model";

export function haveFeatureFlagsChanged(
  oldFeatureFlags: FeatureFlag[],
  newFeatureFlags: FeatureFlag[]
): boolean {
  return (
    oldFeatureFlags.length === newFeatureFlags.length &&
    !oldFeatureFlags.every((oldFlag) =>
      newFeatureFlags.some(
        (newFlag) =>
          oldFlag.parameter === newFlag.parameter &&
          oldFlag.isActive === newFlag.isActive
      )
    )
  );
}
