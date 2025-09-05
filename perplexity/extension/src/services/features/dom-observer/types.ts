export type ElementCallback = (element: Element) => void;

export type SubscriptionOptions = {
  id: string | number;
  selector: string | string[];
  onAdd?: ElementCallback;
  onRemove?: ElementCallback;
  existingCheck?: boolean;
  once?: boolean;
};

export type Subscription = {
  id: string | number;
  selector: string | string[];
  onAdd?: ElementCallback;
  onRemove?: ElementCallback;
  once?: boolean;
  triggeredCallbacks?: Set<"onAdd" | "onRemove">;
};

export type SelectorCallbackData = {
  onAdd: ElementCallback[];
  onRemove: ElementCallback[];
  refCount: number;
};

export type ProcessingType = "add" | "remove";

export type DomObserverTracking = {
  [key: string]: boolean | (string | number)[];
} & {
  subs?: (string | number)[];
};

declare global {
  interface Element {
    __cplxDomObserver?: DomObserverTracking;
  }
}

type DomObserverPrefix =
  | "home"
  | "queryBoxes"
  | "thread"
  | "sidebar"
  | "spacesPage"
  | "settingsPage"
  | "misc";

export type DomObserverId = `${DomObserverPrefix}:${string}` & {
  readonly __brand: unique symbol;
};

export function createDomObserverId(
  prefix: DomObserverPrefix,
  id?: string,
): DomObserverId {
  return `${prefix}:${id ?? "default"}` as DomObserverId;
}
