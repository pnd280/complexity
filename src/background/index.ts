import { BackgroundAction } from '@/utils/background';

if (!import.meta.env.DEV) {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('/page/options.html') + '?tab=changelog',
    });
  });
}

chrome.runtime.onMessage.addListener(
  async (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    const action: BackgroundAction = message.action;

    switch (action) {
      case 'openChangelog':
        chrome.tabs.create({
          url: chrome.runtime.getURL('/page/options.html') + '?tab=changelog',
        });
        break;
      case 'getTabId':
        if (sender.tab) {
          sendResponse({ tabId: sender.tab.id });
        }
        break;
    }
    return true;
  }
);