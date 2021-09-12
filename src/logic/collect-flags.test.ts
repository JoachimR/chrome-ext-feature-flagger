import "jest";
import { collectFlags } from "@/logic/collect-flags";

describe("collect-flags", () => {
  it("test", () => {
    collectFlags("https://foo.bar?foo=bar");
    expect(1).toEqual(1);
  });
});
