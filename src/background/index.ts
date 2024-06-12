chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('options.html') + '?tab=changelog',
  });
});

chrome.runtime.onMessage.addListener(
  async (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    switch (message.action) {
      case 'getTabId':
        if (sender.tab) {
          sendResponse({ tabId: sender.tab.id });
        }
        break;
      case 'injectScript':
        if (sender.tab) {
          const tabId = sender.tab.id;

          if (import.meta.env.DEV) {
            await injectScript({
              tabId: tabId!,
              scriptId: 'messenger',
              scriptUrl: chrome.runtime.getURL(getWebpageDepsPath('messenger')),
              waitForExecution: true,
            });
          }

          await injectScript({
            tabId: tabId!,
            scriptId: 'ws-hook',
            scriptUrl: chrome.runtime.getURL(getWebpageDepsPath('ws-hook')),
            waitForExecution: true,
          });

          sendResponse({ message: 'WSHook injected' });
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

function injectScript({
  tabId,
  scriptId,
  scriptUrl,
  waitForExecution = false,
}: {
  tabId: number;
  scriptId: string;
  scriptUrl: string;
  waitForExecution?: boolean;
}) {
  return chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (url: string, id: string, wait: boolean) => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.id = id;
        script.type = 'module';
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error(`Failed to load script: ${url}`));
        document.body.appendChild(script);
        if (!wait) resolve();
      });
    },
    args: [scriptUrl, scriptId, waitForExecution],
    injectImmediately: true,
    world: 'MAIN',
  });
}

function getWebpageDepsPath(type: 'messenger' | 'ws-hook') {
  if (import.meta.env.DEV) {
    return `/src/content-script/webpage/${type}.ts.js`;
  }

  return `/assets/chunk-webpage.min.js`;
}
