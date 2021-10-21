import {
  loadStoredFeatureFlags,
  storeFeatureFlags,
} from "@/popup/logic/browser-extension/storage";
import { FeatureFlag } from "@/popup/model/model";
import { ChromeAPI } from "@/popup/logic/browser-extension/chrome/chrome-api";

describe("storage", () => {
  describe("loadStoredFeatureFlags", () => {
    let data: { [key: string]: unknown } = {};
    const chromeAPI: ChromeAPI = {
      storage: {
        get: (key, callback) => callback(data),
      },
    } as ChromeAPI;

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
        chromeAPI
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
        chromeAPI
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
        chromeAPI
      );
    });
  });

  describe("storeFeatureFlags", () => {
    const setMock: (items: { [key: string]: unknown }) => Promise<void> =
      jest.fn();
    const chromeAPI: ChromeAPI = {
      storage: {
        set: setMock,
      },
    } as ChromeAPI;

    const featureFlags: FeatureFlag[] = [
      { parameter: "parameter1", isActive: true },
      { parameter: "parameter2", isActive: false },
    ];
    it("does not store when hostname is missing", () => {
      storeFeatureFlags("", featureFlags, chromeAPI);
      expect(setMock).not.toHaveBeenCalled();
    });
    it("stores when hostname is provided", () => {
      storeFeatureFlags("some-url.com", featureFlags, chromeAPI);
      expect(setMock).not.toHaveBeenCalledWith("some-url.com", featureFlags);
    });
  });
});
