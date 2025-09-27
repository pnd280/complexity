import { NetworkInterceptMiddlewareManagerService } from "@/plugins/_core/main-world/network-intercept/_service/service-init.loader";
import type { BeaconEventDataCatalog } from "@/plugins/_core/main-world/network-intercept/listeners.types";

export function initBeaconInterceptor() {
  const originalSendBeacon = navigator.sendBeacon;

  navigator.sendBeacon = function (url: URL, data?: BodyInit | null) {
    if (data == null || (typeof data !== "string" && !(data instanceof Blob))) {
      return originalSendBeacon.call(navigator, url, data);
    }

    const urlString = url.toString();

    const handleData = (stringData: string) => {
      NetworkInterceptMiddlewareManagerService.Proxy.executeMiddlewares({
        data: {
          type: "networkIntercept:beaconEvent",
          event: "request",
          payload: { url: urlString, data: stringData },
        },
      })
        .then((resp) => {
          const payload =
            resp.payload as BeaconEventDataCatalog["request"]["payload"];

          if (payload?.data === "") return;

          if (payload?.data && payload.data !== stringData) {
            data =
              data instanceof Blob
                ? new Blob([payload.data], { type: data.type })
                : payload.data;
          }

          const result = originalSendBeacon.call(navigator, url, data);

          NetworkInterceptMiddlewareManagerService.Proxy.noop({
            data: {
              type: "networkIntercept:beaconEvent",
              event: "response",
              payload: {
                url: urlString,
                success: result,
              },
            },
          });
        })
        .catch(() => {
          const result = originalSendBeacon.call(navigator, url, data);

          NetworkInterceptMiddlewareManagerService.Proxy.noop({
            data: {
              type: "networkIntercept:beaconEvent",
              event: "response",
              payload: { url: urlString, success: result },
            },
          });
        });
    };

    if (typeof data === "string") {
      handleData(data);
    } else {
      data
        .text()
        .then(handleData)
        .catch(() => {
          originalSendBeacon.call(navigator, url, data);
        });
    }

    return true;
  };
}
