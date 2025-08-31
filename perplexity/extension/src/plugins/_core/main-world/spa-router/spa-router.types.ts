export type RouterEvent = "push" | "replace" | "pop";

export type RouteChangeState = "pending" | "complete";

export interface RouteChangeEventDetail {
  state: RouteChangeState;
  trigger: RouterEvent;
  newUrl: string;
}
