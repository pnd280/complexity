export type BackgroundAction = 'openChangelog' | 'getTabId' | 'injectScript';

async function sendMessage({
  action,
  payload,
}: {
  action: BackgroundAction;
  payload?: any;
}) {
  return await chrome.runtime.sendMessage({ action, payload });
}

const background = {
  sendMessage,
};

export default background;
