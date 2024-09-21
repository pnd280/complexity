import { debounce, throttle } from "lodash-es";

import {
  CustomCallback,
  DomObserverConfig,
  MutationCallback,
} from "@/types/dom-observer.types";
import DomObserver from "@/utils/DomObserver/DomObserver";
import { batchMutations } from "@/utils/DomObserver/mutation-batcher";

const handleError = (error: unknown, context: string): void => {
  console.error(
    `Error in ${context}: ${error instanceof Error ? error.message : String(error)}`,
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

export const createCallback = (config: DomObserverConfig): MutationCallback => {
  const processChunk = async (
    chunk: MutationRecord[],
    observer: MutationObserver,
  ) => {
    const batchedMutations = batchMutations(chunk);

    for (const mutation of batchedMutations) {
      if (mutation.type === "childList") {
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
                node,
              );
            }
          }
        }
      } else if (mutation.type === "attributes" && config.onAttrChange) {
        await safeExecute<[Element, string[] | null]>(
          config.onAttrChange,
          mutation.target as Element,
          mutation.attributeName as unknown as string[],
        );
      }
    }

    if (config.onAny) {
      await safeExecute<Parameters<MutationCallback>>(
        config.onAny,
        batchedMutations,
        observer,
      );
    }
  };

  let callback: MutationCallback = (
    mutations: MutationRecord[],
    observer: MutationObserver,
  ) => {
    DomObserver.updateQueue.enqueue(() => processChunk(mutations, observer));
  };

  if (config.debounceTime != null) {
    callback = debounce(callback, config.debounceTime, {
      leading: true,
      trailing: true,
      maxWait: 1000,
    });
  } else if (config.throttleTime != null) {
    callback = throttle(callback, config.throttleTime, {
      leading: true,
      trailing: true,
    });
  }

  return callback;
};
