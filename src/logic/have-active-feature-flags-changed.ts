import type { FeatureFlag } from '../model/model.ts'

export function haveActiveFeatureFlagsChanged({
	oldFFs,
	newFFs,
}: { oldFFs: FeatureFlag[]; newFFs: FeatureFlag[] }): boolean {
	return (
		oldFFs.length !== newFFs.length ||
		!oldFFs.every((oldFlag) =>
			newFFs.some(
				(newFlag) =>
					oldFlag.parameter === newFlag.parameter &&
					oldFlag.isActive === newFlag.isActive,
			),
		)
	)
}
