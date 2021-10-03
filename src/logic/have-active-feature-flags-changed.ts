import { FeatureFlag, isActiveFeatureFlag } from "@/popup/model";

export function haveActiveFeatureFlagsChanged(
  oldFeatureFlags: FeatureFlag[],
  newFeatureFlags: FeatureFlag[]
): boolean {
  const oldActiveFeatureFlags = oldFeatureFlags.filter(isActiveFeatureFlag);
  const newActiveFeatureFlags = newFeatureFlags.filter(isActiveFeatureFlag);
  return (
    oldActiveFeatureFlags.length !== newActiveFeatureFlags.length ||
    !oldActiveFeatureFlags.every((oldFlag) =>
      newActiveFeatureFlags.some(
        (newFlag) =>
          oldFlag.parameter === newFlag.parameter &&
          oldFlag.isActive === newFlag.isActive
      )
    )
  );
}
