/// <reference types="chrome"/>

export type TabId = number;
export const unknownTabId = -1;

export function startListeningForUrlChange(): void {
  chrome.tabs.onUpdated.addListener(
    (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (changeInfo.url) {
        chrome.runtime.sendMessage(createMessage(tabId, changeInfo.url));
      }
    }
  );
}

export async function reloadTabWithUrl(url: URL): Promise<void> {
  await chrome.tabs.update({ url: url.toString() });
}

export function initPopup(
  callback: (tabId: number, url: string) => void
): void {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    (tabs: chrome.tabs.Tab[]) => {
      if (tabs.length > 0) {
        const tab = tabs[0];
        const tabId = tab.id ?? unknownTabId;
        const url = tab.url;
        if (tabId !== unknownTabId && url !== undefined) {
          callback(tabId, url);
        }
      }
    }
  );
}

export function registerListenerForUrlChange(
  callback: (tabId: number, url: string) => void
): void {
  chrome.runtime.onMessage.addListener((message) => {
    if (isMessageUrlChanged(message)) {
      callback(message.tabId, message.url);
    }
  });
}

const messageUrlChangedType = "URL_CHANGED";

interface MessageUrlChanged {
  type: typeof messageUrlChangedType;
  tabId: number;
  url: string;
}

function isMessageUrlChanged(message: unknown): message is MessageUrlChanged {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    // @ts-ignore
    typeof message.type === "string" &&
    // @ts-ignore
    message.type === messageUrlChangedType
  );
}

function createMessage(tabId: number, url: string): MessageUrlChanged {
  return {
    type: messageUrlChangedType,
    tabId,
    url,
  };
}
