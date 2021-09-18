export type SearchParameter = string;
export type IsActive = boolean;

export type FeatureFlag = [SearchParameter, IsActive];
export type FeatureFlags = FeatureFlag[];

export type FeatureFlagsRecord = Record<SearchParameter, IsActive>;

export type UrlHostname = string;
export type HistoryUrlRecord = Record<UrlHostname, FeatureFlagsRecord>;
