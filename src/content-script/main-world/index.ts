import { injectMainWorldScript } from "@/utils/utils";

import reactNode from "@/content-script/main-world/react-node?script&module";
import router from "@/content-script/main-world/router?script&module";
import wsHook from "@/content-script/main-world/ws-hook?script&module";

// Standalone main world scripts
injectMainWorldScript({
  url: browser.runtime.getURL(wsHook),
  head: true,
});
injectMainWorldScript({
  url: browser.runtime.getURL(router),
  head: true,
});
injectMainWorldScript({
  url: browser.runtime.getURL(reactNode),
  head: true,
});
