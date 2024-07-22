export type MutationCallback = (
  mutations: MutationRecord[],
  observer: MutationObserver,
) => void | Promise<void>;

export type CustomCallback = (element: Element) => void | Promise<void>;

export type MutationConfig = {
  attributes?: boolean;
  childList?: boolean;
  subtree?: boolean;
  attributeFilter?: string[];
  characterData?: boolean;
};

export type DOMObserverConfig = {
  target: Element | null;
  config: MutationConfig;
  onAdd?: CustomCallback;
  onRemove?: CustomCallback;
  onAttrChange?: (
    element: Element,
    attributeName: string | null,
  ) => void | Promise<void>;
  onAny?: MutationCallback;
  debounceTime?: number;
  throttleTime?: number;
  source?: "hook" | "default";
};

export type DOMObserverInstance = {
  observer: MutationObserver;
  config: DOMObserverConfig;
  isPaused: boolean;
};
