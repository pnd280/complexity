import { registerPromptsLibraryRepo } from '@/services/database/repository';
import { BackgroundAction } from '@/utils/background';

registerPromptsLibraryRepo();

if (!import.meta.env.DEV) {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('options.html') + '?tab=changelog',
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
          url: chrome.runtime.getURL('options.html') + '?tab=changelog',
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

chrome.tabs.onRemoved.addListener((tabId: number) => {
  const keyToRemove = `sessionStore-${tabId}`;

  chrome.storage.local.remove(keyToRemove, () => {
    if (chrome.runtime.lastError) {
      console.error(
        `Error removing key ${keyToRemove}:`,
        chrome.runtime.lastError
      );
    } else {
      console.log(`Key ${keyToRemove} removed successfully.`);
    }
  });
});
