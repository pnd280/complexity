export type WsParsedMessage = {
  messageCode: number;
  event: string;
  data: any[] | any;
};
export type RouterEvent =
  | "push"
  | "replace"
  | "popstate"
  | "routeChangeComplete";

export function isParsedWsMessage(data: unknown): data is WsParsedMessage {
  return data != null && typeof data === "object" && "messageCode" in data;
}
