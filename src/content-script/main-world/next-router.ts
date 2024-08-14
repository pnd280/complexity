import $ from "jquery";

import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import { MessageData } from "@/types/webpage-messenger.types";
import { RouterEvent } from "@/types/ws.types";
import { mainWorldExec } from "@/utils/hof";

type NextRouter = typeof window.next;

class NextRouterProxy {
  private static instance: NextRouterProxy | null = null;

  private constructor() {}

  static getInstance(): NextRouterProxy {
    if (!NextRouterProxy.instance) {
      NextRouterProxy.instance = new NextRouterProxy();
    }
    return NextRouterProxy.instance;
  }

  async initialize() {
    await this.waitForNextjsObject();

    this.proxyRouterMethods();
    this.setupEventListeners();
    this.setupRouteChangeListener();
  }

  async waitForNextjsObject(): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (window.next !== undefined && window.next.router !== undefined) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  private proxyRouterMethods(): void {
    const router = window.next!.router;
    const originalPush = router.push;
    const originalReplaceState = history.replaceState;

    router.push = this.createProxiedPush(originalPush);
    history.replaceState = this.createProxiedReplaceState(originalReplaceState);
  }

  private createProxiedPush(
    originalPush: NonNullable<NextRouter>["router"]["push"],
  ) {
    return async function (
      this: NextRouter,
      url: string,
      as?: string,
      options?: any,
    ): Promise<boolean> {
      const result = await originalPush.apply(this, [url, as, options]);
      NextRouterProxy.getInstance().dispatchRouteChange("push", url);
      return result;
    };
  }

  private createProxiedReplaceState(
    originalReplaceState: typeof history.replaceState,
  ) {
    return function (
      this: History,
      data: any,
      unused: string,
      url?: string | URL | null,
    ): void {
      originalReplaceState.apply(this, [data, unused, url]);
      NextRouterProxy.getInstance().dispatchRouteChange(
        "replace",
        url as string,
      );
    };
  }

  private setupEventListeners(): void {
    window.addEventListener("popstate", () =>
      this.dispatchRouteChange("popstate", window.location.pathname),
    );
  }

  private dispatchRouteChange(trigger: RouterEvent, url: string): void {
    // hacky solution since router events are no longer available in next app router 🥲 (routeChangeStart, routeChangeComplete)
    requestAnimationFrame(() => {
      webpageMessenger.sendMessage({
        event: "routeChange",
        payload: {
          url: new URL(url, window.location.origin).href,
          trigger,
        },
      });
    });
  }

  private setupRouteChangeListener(): void {
    webpageMessenger.onMessage(
      "routeToPage",
      this.handleRouteToPage.bind(this),
    );
  }

  private async handleRouteToPage(
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

mainWorldExec(() =>
  $(() => {
    NextRouterProxy.getInstance().initialize();
  }),
)();
