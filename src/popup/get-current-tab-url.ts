/// <reference types="chrome"/>

export function getCurrentTabUrl(callback: (url: string) => void): void {
  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  chrome.tabs.query(queryInfo, function (tabs: chrome.tabs.Tab[]) {
    const tab = tabs[0];
    const url = tab.url;
    if (url !== undefined) {
      callback(url);
    }
  });
}
