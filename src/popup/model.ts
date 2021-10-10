export type SearchParameter = string;
export type IsActive = boolean;

export interface FeatureFlag {
  parameter: SearchParameter;
  isActive: IsActive;
}
export interface ActiveFeatureFlag extends FeatureFlag {
  isActive: true;
}

export function isActiveFeatureFlag(
  featureFlag: FeatureFlag
): featureFlag is ActiveFeatureFlag {
  return featureFlag.isActive;
}

export type FeatureFlagsRecord = Record<SearchParameter, FeatureFlag>;

export type UrlHostname = string;
export type HistoryUrlRecord = Record<UrlHostname, FeatureFlagsRecord>;

export type TagId = string;

export enum TagItemGroup {
  Inactive = "inactive",
  Active = "active",
}
export interface TagItem {
  id: TagId;
  name: string;
  group: TagItemGroup;
}
