import { FeatureFlag } from "@/logic/feature-flag";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const queryString = require("query-string");

export function collectFlags(url: string): FeatureFlag[] {
  if (!url) {
    return [];
  }

  const q = queryString.parse("foo[]=1&foo[]=2&foo[]=3", {
    arrayFormat: "bracket",
  });
  console.log(JSON.stringify(q, null, 4));

  return [];
}
