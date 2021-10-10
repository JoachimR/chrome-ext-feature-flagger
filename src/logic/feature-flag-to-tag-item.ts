import { FeatureFlag, TagItem, TagItemGroup } from "@/popup/model";

export const featureFlagToTagItem = (featureFlag: FeatureFlag): TagItem => ({
  id: "id_" + featureFlag.parameter,
  name: featureFlag.parameter,
  group: featureFlag.isActive ? TagItemGroup.Active : TagItemGroup.Inactive,
});
