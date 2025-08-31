import type {
  Middleware,
  MiddlewareNameBasedPriority,
} from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager.types";
import type { MiddlewareData } from "@/plugins/_core/main-world/network-intercept/listeners.types";

export class NetworkInterceptMiddlewareManager {
  private static instance: NetworkInterceptMiddlewareManager;
  private middlewares: Middleware[] = [];

  overridesReady = false;

  private constructor() {}

  static getInstance(): NetworkInterceptMiddlewareManager {
    if (NetworkInterceptMiddlewareManager.instance == null) {
      NetworkInterceptMiddlewareManager.instance =
        new NetworkInterceptMiddlewareManager();
    }
    return NetworkInterceptMiddlewareManager.instance;
  }

  setOverridesReady(overridesReady: boolean): void {
    NetworkInterceptMiddlewareManager.instance.overridesReady = overridesReady;
  }

  addMiddleware(middleware: Middleware): void {
    if (this.middlewares.find((m) => m.id === middleware.id)) {
      throw new Error(`Middleware with id ${middleware.id} already exists`);
    }

    if (middleware.priority) {
      switch (middleware.priority.position) {
        case "first":
          this.middlewares.unshift(middleware);
          break;
        case "beforeId":
        case "afterId": {
          const index = this.middlewares.findIndex(
            (m) =>
              m.id === (middleware.priority as MiddlewareNameBasedPriority).id,
          );
          if (index !== -1) {
            this.middlewares.splice(
              middleware.priority.position === "beforeId" ? index : index + 1,
              0,
              middleware,
            );
          } else {
            this.middlewares.push(middleware);
          }
          break;
        }
        case "last":
        default:
          this.middlewares.push(middleware);
      }
    } else {
      this.middlewares.push(middleware);
    }
  }

  updateMiddleware(middleware: Middleware): void {
    this.removeMiddleware(middleware.id);
    this.addMiddleware(middleware);
  }

  removeMiddleware(middlewareId: string): void {
    this.middlewares = this.middlewares.filter(
      (middleware) => middleware.id !== middlewareId,
    );
  }

  getMiddlewares(): Middleware[] {
    return this.middlewares;
  }

  async executeMiddlewares<T extends MiddlewareData>({
    data,
  }: {
    data: T;
  }): Promise<T> {
    let currentData = { ...data };

    for (const middleware of this.middlewares) {
      try {
        const newData = await middleware.middlewareFn({
          data: currentData,
          stopPropagation: (newPayloadData) => {
            if (newPayloadData != null) {
              currentData = this.updatePayload(currentData, newPayloadData);
            }
            throw new Error("STOP_PROPAGATION");
          },
          skip: () => {
            throw new Error("SKIP");
          },
          removeMiddleware: () => this.removeMiddleware(middleware.id),
        });

        currentData = this.updatePayload(currentData, newData);
      } catch (error: unknown) {
        if (error instanceof Error && error.message === "STOP_PROPAGATION") {
          break;
        } else if (error instanceof Error && error.message === "SKIP") {
          continue;
        }
        throw error;
      }
    }

    return currentData;
  }

  private updatePayload<T extends MiddlewareData>(
    currentData: T,
    newData: string,
  ): T {
    if (
      currentData.type === "networkIntercept:beaconEvent" &&
      currentData.event === "response"
    ) {
      return currentData;
    }

    return {
      ...currentData,
      payload: {
        ...currentData.payload,
        data: newData,
      },
    };
  }

  async noop({ data }: { data: MiddlewareData }) {
    switch (data.type) {
      case "networkIntercept:webSocketEvent":
        console.log("%cwebSocketEvent", "color: blue", {
          event: data.event,
          payload: data.payload,
        });
        break;
      case "networkIntercept:fetchEvent":
        console.log("%cfetchEvent", "color: red", {
          event: data.event,
          payload: data.payload,
        });
        break;
      case "networkIntercept:beaconEvent":
        console.log("%cbeaconEvent", "color: purple", {
          event: data.event,
          payload: data.payload,
        });
        break;
      case "networkIntercept:xhrEvent":
        console.log("%cxhrEvent", "color: green", {
          event: data.event,
          payload: data.payload,
        });
        break;
      default:
        break;
    }
  }
}
