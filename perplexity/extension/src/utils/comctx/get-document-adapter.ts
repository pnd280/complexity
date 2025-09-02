import {
  ChromiumDocumentAdapter,
  FirefoxDocumentAdapter,
} from "@comctx-adapters/core";

import { APP_CONFIG } from "@/app.config";

export function getDocumentAdapter(namespace?: string) {
  return APP_CONFIG.BROWSER === "chrome"
    ? new ChromiumDocumentAdapter(namespace)
    : new FirefoxDocumentAdapter(namespace);
}
