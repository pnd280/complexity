import $ from "jquery";

import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import { MessageData } from "@/types/webpage-messenger.types";
import { RouterEvent } from "@/types/ws.types";
import { mainWorldExec } from "@/utils/hof";
import { waitForNextjsHydration } from "@/utils/utils";

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
    await waitForNextjsHydration();

    this.proxyRouterMethods();
    this.setupEventListeners();
    this.setupRouteChangeListener();
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
      NextRouterProxy.getInstance().dispatchRouteChange("push");
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
      NextRouterProxy.getInstance().dispatchRouteChange("replace");
    };
  }

  private setupEventListeners(): void {
    window.addEventListener("popstate", () =>
      this.dispatchRouteChange("popstate"),
    );
    window.next!.router.events.on("routeChangeComplete", () =>
      this.dispatchRouteChange("routeChangeComplete"),
    );
  }

  private dispatchRouteChange(trigger: RouterEvent): void {
    webpageMessenger.sendMessage({
      event: "routeChange",
      payload: {
        url: window.location.href,
        trigger,
      },
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
      console.warn("Next.js router not found. Cannot route to page.");
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
