import {
  LoadFromStorageFn,
  loadStoredFeatureFlags,
  storeFeatureFlags,
  StoreToStorageFn,
} from "@/chrome/storage";
import { FeatureFlag } from "@/popup/model";

describe("storage", () => {
  describe("loadStoredFeatureFlags", () => {
    let data: { [key: string]: unknown } = {};
    const loadFromStorageFn: LoadFromStorageFn = (
      key: string,
      callback: (result: { [key: string]: unknown }) => void
    ) => {
      callback(data);
    };

    it("returns empty array for unknown hostname", () => {
      const items: unknown[] = [
        { parameter: "parameter1", isActive: true },
        { parameter: "parameter2", isActive: false },
      ];
      data = {
        "some-url.com": items,
      };
      loadStoredFeatureFlags(
        "https://wrong-host-name.com",
        (result) => {
          expect(result).toEqual([]);
        },
        loadFromStorageFn
      );
    });

    it("loads all flags for hostname sorted alphabetically", () => {
      const items: unknown[] = [
        { parameter: "b", isActive: true },
        { parameter: "c", isActive: false },
        { parameter: "a", isActive: true },
      ];
      data = {
        "some-url.com": items,
      };
      loadStoredFeatureFlags(
        "https://some-url.com",
        (result) => {
          expect(result).toEqual([
            { parameter: "a", isActive: true },
            { parameter: "b", isActive: true },
            { parameter: "c", isActive: false },
          ]);
        },
        loadFromStorageFn
      );
    });

    it("filters out invalid items", () => {
      const items: unknown[] = [
        { parameter: "parameter1", isActive: true },
        { parameter: 123, isActive: true },
        { wrong_name: "parameter2", isActive: false },
        { parameter: "parameter3", isActive: "true" },
        { parameter: "parameter4", isActive: "false" },
      ];
      data = {
        "some-url.com": items,
      };
      loadStoredFeatureFlags(
        "https://some-url.com",
        (result) => {
          expect(result).toEqual([{ parameter: "parameter1", isActive: true }]);
        },
        loadFromStorageFn
      );
    });
  });

  describe("storeFeatureFlags", () => {
    const storeToStorageMock: StoreToStorageFn = jest.fn();
    const featureFlags: FeatureFlag[] = [
      { parameter: "parameter1", isActive: true },
      { parameter: "parameter2", isActive: false },
    ];
    it("does not store when hostname is missing", () => {
      storeFeatureFlags("", featureFlags, storeToStorageMock);
      expect(storeToStorageMock).not.toHaveBeenCalled();
    });
    it("stores when hostname is provided", () => {
      storeFeatureFlags("some-url.com", featureFlags, storeToStorageMock);
      expect(storeToStorageMock).not.toHaveBeenCalledWith(
        "some-url.com",
        featureFlags
      );
    });
  });
});
