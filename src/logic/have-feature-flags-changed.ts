import { FeatureFlag } from "@/popup/model";

export function haveFeatureFlagsChanged(
  oldFlags: FeatureFlag[],
  newFlags: FeatureFlag[]
): boolean {
  return (
    oldFlags.length !== newFlags.length ||
    !oldFlags.every((oldFlag) =>
      newFlags.some(
        (newFlag) =>
          oldFlag.parameter === newFlag.parameter &&
          oldFlag.isActive === newFlag.isActive
      )
    )
  );
}
