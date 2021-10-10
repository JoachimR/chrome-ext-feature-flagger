import { FeatureFlag, TagItem, TagItemGroup } from "@/popup/model";

export const tagItemToFeatureFlag = (tagItem: TagItem): FeatureFlag => ({
  parameter: tagItem.name,
  isActive: tagItem.group === TagItemGroup.Active,
});
