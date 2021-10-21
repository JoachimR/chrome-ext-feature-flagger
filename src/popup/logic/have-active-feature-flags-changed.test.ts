import { haveActiveFeatureFlagsChanged } from "@/popup/logic/have-active-feature-flags-changed";
import { FeatureFlag } from "@/popup/model/model";

describe("haveActiveFeatureFlagsChanged", () => {
  it.each([
    [[], [], false],
    [
      [{ parameter: "abc", isActive: true }],
      [{ parameter: "abc", isActive: true }],
      false,
    ],
    [
      [{ parameter: "abc", isActive: false }],
      [{ parameter: "def", isActive: false }],
      false,
    ],
    [
      [{ parameter: "abc", isActive: false }],
      [{ parameter: "def", isActive: true }],
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
      false,
    ],
    [[{ parameter: "abc", isActive: false }], [], false],
    [
      [{ parameter: "abc", isActive: false }],
      [{ parameter: "def", isActive: false }],
      false,
    ],
  ])(
    "%j ==> %j ==> %s",
    (
      oldFeatureFlags: FeatureFlag[],
      newFeatureFlags: FeatureFlag[],
      expectHasChanged: boolean
    ) => {
      expect(
        haveActiveFeatureFlagsChanged(oldFeatureFlags, newFeatureFlags)
      ).toBe(expectHasChanged);
    }
  );
});
