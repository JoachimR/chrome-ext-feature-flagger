/// <reference types="chrome"/>

export async function setTabUrl(url: URL): Promise<void> {
  console.log(url.toString());
  await chrome.tabs.update({ url: url.toString() });
}
