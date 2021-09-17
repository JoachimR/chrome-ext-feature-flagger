import "jest";
import { collectFeatureFlags } from "@/logic/collect-feature-flags";
import { FeatureFlags } from "@/model";

describe("collect-feature-flags", () => {
  const scenarios: [string, FeatureFlags][] = [
    ["", []],
    ["abc=", []],
    ["?abc=", []],
    ["?abc=hello", []],
    ["?abc=1", [["abc", true]]],
    ["?abc=0", [["abc", false]]],
    ["?abc=1&def=hello", [["abc", true]]],
    ["?abc=0&def=hello", [["abc", false]]],
    ["?abc=1&abc=hello", [["abc", true]]],
    ["?abc=0&abc=hello", [["abc", false]]],
    ["?abc=1&abc=0", [["abc", true]]],
    ["?abc=0&abc=1", [["abc", false]]],
    [
      "?abc=1&def=1",
      [
        ["abc", true],
        ["def", true],
      ],
    ],
    [
      "?abc=1&def=0",
      [
        ["abc", true],
        ["def", false],
      ],
    ],
    [
      "?abc=0&def=1",
      [
        ["abc", false],
        ["def", true],
      ],
    ],
    [
      "?abc=0&def=0",
      [
        ["abc", false],
        ["def", false],
      ],
    ],
  ];

  test.each(scenarios)(
    "https://foo.bar%s",
    (search: string, expected: FeatureFlags) => {
      expect(collectFeatureFlags("https://foo.bar" + search)).toEqual(expected);
    }
  );
});
