import { injectMainWorldScript } from "@/utils/utils";

import colorScheme from "@/content-script/main-world/color-scheme?script&module";
import nextRouter from "@/content-script/main-world/next-router?script&module";
import reactNode from "@/content-script/main-world/react-node?script&module";
import wsErr from "@/content-script/main-world/ws-err?script&module";
import wsHook from "@/content-script/main-world/ws-hook?script&module";

// Standalone main world scripts

injectMainWorldScript({
  url: chrome.runtime.getURL(wsErr),
  head: true,
});
injectMainWorldScript({
  url: chrome.runtime.getURL(wsHook),
  head: true,
});
injectMainWorldScript({
  url: chrome.runtime.getURL(nextRouter),
  head: true,
});
injectMainWorldScript({
  url: chrome.runtime.getURL(reactNode),
  head: true,
});
injectMainWorldScript({
  url: chrome.runtime.getURL(colorScheme),
  head: true,
});
