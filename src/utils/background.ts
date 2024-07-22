export type BackgroundAction = "openChangelog" | "openCustomTheme" | "getTabId";

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
