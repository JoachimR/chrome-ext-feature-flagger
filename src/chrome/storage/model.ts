import { FeatureFlag } from "@/popup/model";

export type LoadFromStorageFn = (
  hostname: string,
  callback: (result: { [hostname: string]: unknown }) => void
) => void;

export type StoreToStorageFn = (items: {
  [hostname: string]: FeatureFlag[];
}) => Promise<void>;
