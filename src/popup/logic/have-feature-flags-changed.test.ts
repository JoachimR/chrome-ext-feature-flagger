import { FeatureFlag } from "@/popup/model/model";
import { haveFeatureFlagsChanged } from "@/popup/logic/have-feature-flags-changed";

describe("haveFeatureFlagsChanged", () => {
  it.each([
    [[], [], false],
    [
      [{ parameter: "abc", isActive: true }],
      [{ parameter: "abc", isActive: true }],
      false,
    ],
    [
      [{ parameter: "abc", isActive: true }],
      [{ parameter: "abc", isActive: false }],
      true,
    ],
    [
      [
        { parameter: "abc", isActive: true },
        { parameter: "def", isActive: true },
      ],
      [
        { parameter: "def", isActive: true },
        { parameter: "abc", isActive: false },
      ],
      true,
    ],
    [
      [{ parameter: "abc", isActive: true }],
      [
        { parameter: "def", isActive: true },
        { parameter: "abc", isActive: true },
      ],
      true,
    ],
    [
      [{ parameter: "abc", isActive: true }],
      [
        { parameter: "def", isActive: false },
        { parameter: "abc", isActive: true },
      ],
      true,
    ],
    [[{ parameter: "abc", isActive: false }], [], true],
    [
      [{ parameter: "abc", isActive: false }],
      [{ parameter: "def", isActive: false }],
      true,
    ],
  ])(
    "%j ==> %j ==> %s",
    (
      oldFeatureFlags: FeatureFlag[],
      newFeatureFlags: FeatureFlag[],
      expectHasChanged: boolean
    ) => {
      expect(haveFeatureFlagsChanged(oldFeatureFlags, newFeatureFlags)).toBe(
        expectHasChanged
      );
    }
  );
});
