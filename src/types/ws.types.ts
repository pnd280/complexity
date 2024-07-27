export type WSParsedMessage = {
  messageCode: number;
  event: string;
  data: any[] | any;
};
export type RouterEvent =
  | "push"
  | "replace"
  | "popstate"
  | "routeChangeComplete";

export function isParsedWSMessage(data: any): data is WSParsedMessage {
  return data && typeof data === "object" && "messageCode" in data;
}
