import {
  debounce,
  throttle,
} from 'lodash-es';

import {
  CustomCallback,
  DOMObserverConfig,
  MutationCallback,
} from '@/types/DOMObserver';

const handleError = (error: unknown, context: string): void => {
  console.error(
    `Error in ${context}: ${error instanceof Error ? error.message : String(error)}`
  );
};

const safeExecute = async <T extends unknown[]>(
  fn: (...args: T) => void | Promise<void>,
  ...args: T
): Promise<void> => {
  try {
    const result = fn(...args);
    if (result instanceof Promise) {
      await result;
    }
  } catch (error) {
    handleError(error, fn.name);
  }
};

export const createCallback = (config: DOMObserverConfig): MutationCallback => {
  let callback: MutationCallback = async (
    mutations: MutationRecord[],
    observer: MutationObserver
  ) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        if (config.onAdd) {
          for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
              await safeExecute<Parameters<CustomCallback>>(config.onAdd, node);
            }
          }
        }

        if (config.onRemove) {
          for (const node of mutation.removedNodes) {
            if (node instanceof Element) {
              await safeExecute<Parameters<CustomCallback>>(
                config.onRemove,
                node
              );
            }
          }
        }
      } else if (mutation.type === 'attributes' && config.onAttrChange) {
        await safeExecute<[Element, string | null]>(
          config.onAttrChange,
          mutation.target as Element,
          mutation.attributeName
        );
      }
    }

    if (config.onAny) {
      await safeExecute<Parameters<MutationCallback>>(
        config.onAny,
        mutations,
        observer
      );
    }
  };

  if (config.debounceTime) {
    callback = debounce(callback, config.debounceTime);
  } else if (config.throttleTime) {
    callback = throttle(callback, config.throttleTime);
  }

  if (config.useRAF) {
    return (mutations: MutationRecord[], observer: MutationObserver) => {
      requestAnimationFrame(() => {
        void callback(mutations, observer);
      });
    };
  }

  if (config.useIdleCallback && 'requestIdleCallback' in window) {
    return (mutations: MutationRecord[], observer: MutationObserver) => {
      requestIdleCallback(() => {
        void callback(mutations, observer);
      });
    };
  }

  return callback;
};
