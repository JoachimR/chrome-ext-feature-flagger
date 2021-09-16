import "jest";
import { collectFlags } from "@/logic/collect-flags";
import { FeatureFlag } from "@/model/feature-flag";

describe("collect-flags", () => {
  test.each([
    ["", []],
    ["abc=", []],
    ["?abc=", []],
    ["?abc=hello", []],
    ["?abc=1", [{ parameter: "abc", active: true }]],
    ["?abc=0", [{ parameter: "abc", active: false }]],
    ["?abc=1&def=hello", [{ parameter: "abc", active: true }]],
    ["?abc=0&def=hello", [{ parameter: "abc", active: false }]],
    ["?abc=1&abc=hello", [{ parameter: "abc", active: true }]],
    ["?abc=0&abc=hello", [{ parameter: "abc", active: false }]],
    ["?abc=1&abc=0", [{ parameter: "abc", active: true }]],
    ["?abc=0&abc=1", [{ parameter: "abc", active: false }]],
    [
      "?abc=1&def=1",
      [
        { parameter: "abc", active: true },
        { parameter: "def", active: true },
      ],
    ],
    [
      "?abc=1&def=0",
      [
        { parameter: "abc", active: true },
        { parameter: "def", active: false },
      ],
    ],
    [
      "?abc=0&def=1",
      [
        { parameter: "abc", active: false },
        { parameter: "def", active: true },
      ],
    ],
    [
      "?abc=0&def=0",
      [
        { parameter: "abc", active: false },
        { parameter: "def", active: false },
      ],
    ],
  ])("https://foo.bar%s", (search: string, expected: FeatureFlag[]) => {
    expect(collectFlags("https://foo.bar" + search)).toEqual(expected);
  });
});
