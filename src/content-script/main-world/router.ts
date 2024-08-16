import $ from "jquery";

import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import { MessageData } from "@/types/webpage-messenger.types";
import { RouterEvent } from "@/types/ws.types";
import { DomSelectors } from "@/utils/DomSelectors";
import { mainWorldExec } from "@/utils/hof";
import UiUtils from "@/utils/UiUtils";
import { whereAmI } from "@/utils/utils";

type NextRouter = typeof window.next;

class Router {
  private static instance: Router | null = null;
  private lastDispatchedUrl: string | null = null;

  private constructor() {}

  static getInstance(): Router {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }

  async initialize(): Promise<void> {
    await this.waitForNextjsGlobalObj();

    this.setupRouter();
    this.setupRouteChangeListener();
  }

  async waitForNextjsGlobalObj(): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (window.next?.router !== undefined) {
          $(document.body).attr("data-nextjs-router", "");
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  private setupRouter(): void {
    const router = window.next!.router;
    const originalPush = router.push;
    const originalReplaceState = history.replaceState;

    router.push = createProxiedPush(originalPush);
    history.replaceState = createProxiedReplaceState(originalReplaceState);
    window.addEventListener("popstate", () =>
      this.dispatchRouteChange("popstate", window.location.pathname),
    );

    function createProxiedPush(
      originalPush: NonNullable<NextRouter>["router"]["push"],
    ) {
      return async function (
        this: NextRouter,
        url: string,
        as?: string,
        options?: Record<string, unknown>,
      ): Promise<boolean> {
        const result = await originalPush.apply(this, [url, as, options]);
        Router.getInstance().dispatchRouteChange("push", url);
        return result;
      };
    }

    function createProxiedReplaceState(
      originalReplaceState: typeof history.replaceState,
    ) {
      return function (
        this: History,
        data: unknown,
        unused: string,
        url?: string | URL | null,
      ): void {
        originalReplaceState.apply(this, [data, unused, url]);
        if (typeof url === "string") {
          Router.getInstance().dispatchRouteChange("replace", url);
        }
      };
    }
  }

  private setupRouteChangeListener(): void {
    webpageMessenger.onMessage("routeToPage", handleRouteToPage);

    async function handleRouteToPage(
      messageData: MessageData<string | { url: string; scroll: boolean }>,
    ): Promise<void> {
      if (typeof window.next === "undefined") {
        alert("Next.js router not found.");
        return;
      }

      const router = window.next.router;
      const { payload } = messageData;

      try {
        if (typeof payload === "object") {
          await router.push(payload.url, undefined, { scroll: payload.scroll });
        } else {
          await router.push(payload, undefined, {
            scroll: payload !== window.location.pathname,
          });
        }
      } catch (error) {
        console.error("Error during route change:", error);
      }
    }
  }

  private async dispatchRouteChange(trigger: RouterEvent, url: string) {
    const fullUrl = new URL(url, window.location.origin).href;

    if (fullUrl !== this.lastDispatchedUrl) {
      this.lastDispatchedUrl = fullUrl;

      // hacky solution since router events are no longer available in next app router 🥲 (routeChangeStart, routeChangeComplete)
      await this.waitForRouteChangeComplete(whereAmI(fullUrl));

      webpageMessenger.sendMessage({
        event: "routeChange",
        payload: {
          url: fullUrl,
          trigger,
        },
      });
    }
  }

  private async waitForRouteChangeComplete(
    location: ReturnType<typeof whereAmI>,
  ) {
    return new Promise<void>((resolve, reject) => {
      const conditions: Partial<Record<typeof location, () => boolean>> = {
        thread: () => {
          try {
            UiUtils.getMessageBlocks();
            return true;
          } catch {
            return false;
          }
        },
        home: () => {
          return $(DomSelectors.HOME.SLOGAN).length > 0;
        },
      };

      const condition = conditions[location];

      if (condition == null) return resolve();

      const interval = setInterval(() => {
        if (condition()) {
          clearInterval(interval);
          return resolve();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        reject(new Error("Route change timeout"));
      }, 5000);
    });
  }
}

export default function initRouter(): void {
  $(() => {
    Router.getInstance().initialize();
  });
}

mainWorldExec(initRouter)();
