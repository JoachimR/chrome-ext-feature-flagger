import { haveFeatureFlagsChanged } from "@/logic/have-feature-flags-changed";

describe("haveFeatureFlagsChanged", () => {
  it("works", () => {
    const oldFeatureFlags = [
      {
        parameter: "foo",
        isActive: true,
      },
      {
        parameter: "bar",
        isActive: true,
      },
    ];
    const newFeatureFlags = [
      {
        parameter: "bar",
        isActive: true,
      },
      {
        parameter: "foo",
        isActive: false,
      },
    ];
    const actual = haveFeatureFlagsChanged(oldFeatureFlags, newFeatureFlags);

    expect(actual).toBe(true);
  });
});
