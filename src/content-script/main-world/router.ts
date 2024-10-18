import { webpageMessenger } from "@/content-script/main-world/webpage-messenger";
import { MaybePromise } from "@/types/utils.types";
import { MessageData } from "@/types/webpage-messenger.types";
import { RouterEvent } from "@/types/ws.types";
import { DomSelectors } from "@/utils/DomSelectors";
import { mainWorldExec } from "@/utils/hof";
import UiUtils from "@/utils/UiUtils";
import { sleep, whereAmI } from "@/utils/utils";

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
    UiUtils.applyRouteIdAttrs(whereAmI());

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
      return async function (this: NextRouter, url: string): Promise<void> {
        originalPush.apply(this, [url]);
        Router.getInstance().dispatchRouteChange("push", url);
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
          router.push(payload.url);
        } else {
          router.push(payload);
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
    return new Promise<void>((resolve) => {
      UiUtils.applyRouteIdAttrs(location);

      const conditions: Partial<
        Record<typeof location, () => MaybePromise<boolean>>
      > = {
        thread: async () => {
          await sleep(1000);

          try {
            return UiUtils.getMessageBlocks(true).length >= 1;
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

      const interval = setInterval(async () => {
        if (await condition()) {
          clearInterval(interval);

          return resolve();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        return resolve();
      }, 3000);
    });
  }
}

function initRouter(): void {
  $(() => {
    Router.getInstance().initialize();
  });
}

mainWorldExec(initRouter)();
