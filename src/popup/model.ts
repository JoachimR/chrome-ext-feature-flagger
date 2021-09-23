export type SearchParameter = string;
export type IsActive = boolean;

export type FeatureFlag = {
  parameter: SearchParameter;
  isActive: IsActive;
};

export type FeatureFlagsRecord = Record<SearchParameter, FeatureFlag>;

export type UrlHostname = string;
export type HistoryUrlRecord = Record<UrlHostname, FeatureFlagsRecord>;

export type TagId = string;

export enum TagItemGroup {
  Group1,
  Group2,
}
export interface TagItem {
  id: TagId;
  name: string;
  group: TagItemGroup;
}
