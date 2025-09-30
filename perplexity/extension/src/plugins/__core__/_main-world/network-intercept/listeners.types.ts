export type MiddlewareData =
  | (WebSocketEventData & { type: "networkIntercept:webSocketEvent" })
  | (XhrEventData & { type: "networkIntercept:xhrEvent" })
  | (FetchEventData & { type: "networkIntercept:fetchEvent" })
  | (BeaconEventData & { type: "networkIntercept:beaconEvent" });

export type WebSocketEventData = {
  event: "send" | "message";
  payload: {
    url: string;
    data: string;
  };
};

export type XhrEventData = {
  event: "request" | "response";
  payload: {
    url: string;
    data: string;
  };
};

export type FetchEventData = FetchEventRequestData | FetchEventResponseData;

type FetchEventRequestData = {
  event: "request";
  payload: {
    url: string;
    data: string;
  };
};

type FetchEventResponseData = {
  event: "response";
  payload: FetchEventRequestData["payload"] & {
    status?: number;
  };
};

export type BeaconEventData = BeaconRequestData | BeaconResponseData;

export type BeaconEventDataCatalog = {
  [P in BeaconEventData as P["event"]]: P;
};

type BeaconRequestData = {
  event: "request";
  payload: {
    url: string;
    data: string;
  };
};

type BeaconResponseData = {
  event: "response";
  payload: {
    url: string;
    success: boolean;
  };
};
