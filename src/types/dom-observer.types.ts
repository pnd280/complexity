export type MutationCallback = (
  mutations: MutationRecord[],
  observer: MutationObserver,
) => void | Promise<void>;

export type CustomCallback = (element: Element) => void | Promise<void>;

export type MutationConfig = MutationObserverInit;

export type DomObserverConfig = {
  target: Element | null;
  config: MutationConfig;
  onAdd?: CustomCallback;
  onRemove?: CustomCallback;
  onAttrChange?: (
    element: Element,
    attributeName: string[] | null,
  ) => void | Promise<void>;
  onAny?: MutationCallback;
  debounceTime?: number;
  throttleTime?: number;
  source?: "hook" | "default";
};

export type DomObserverInstance = {
  observer: MutationObserver;
  config: DomObserverConfig;
  isPaused: boolean;
};
