import { debounce } from 'lodash-es';

import {
  DOMObserverConfig,
  DOMObserverInstance,
  MutationCallback,
} from '@/types/DOMObserver';
import { UpdateQueue } from '@/utils/dom-observer/update-queue';

import { createCallback } from './callback-creator';

class DOMObserver {
  private static instances: Map<string, DOMObserverInstance> = new Map();
  private static isLogging = false;
  private static updateQueue: UpdateQueue = new UpdateQueue();

  public static create(id: string, config: DOMObserverConfig): void {
    if (DOMObserver.instances.has(id)) {
      DOMObserver.update(id, config);
      return;
    }

    const observer = new MutationObserver(
      DOMObserver.handleMutations(id, config)
    );
    const instance: DOMObserverInstance = { observer, config, isPaused: false };

    DOMObserver.instances.set(id, instance);
    DOMObserver.observe(id);
  }

  public static update(
    id: string,
    newConfig: Partial<DOMObserverConfig>
  ): void {
    const instance = DOMObserver.instances.get(id);
    if (!instance) {
      DOMObserver.log(`Observer with id "${id}" not found.`);
      return;
    }

    instance.config = { ...instance.config, ...newConfig };
    instance.observer.disconnect();
    instance.observer = new MutationObserver(
      DOMObserver.handleMutations(id, instance.config)
    );
    DOMObserver.observe(id);
    DOMObserver.log(`Updated observer with id "${id}"`);
  }

  public static destroy(id: string): void {
    const instance = DOMObserver.instances.get(id);
    if (instance) {
      instance.observer.disconnect();
      DOMObserver.instances.delete(id);
      DOMObserver.log(`Destroyed observer with id "${id}"`);
    }
  }

  public static destroyAll(): void {
    for (const id of DOMObserver.instances.keys()) {
      DOMObserver.destroy(id);
    }
  }

  public static pause(id: string): void {
    const instance = DOMObserver.instances.get(id);
    if (instance) {
      instance.observer.disconnect();
      instance.isPaused = true;
      DOMObserver.log(`Paused observer with id "${id}"`);
    }
  }

  public static pauseAll(): void {
    for (const id of DOMObserver.instances.keys()) {
      DOMObserver.pause(id);
    }
  }

  public static resume(id: string): void {
    const instance = DOMObserver.instances.get(id);
    if (instance && instance.isPaused) {
      if (instance.config.target && document.contains(instance.config.target)) {
        DOMObserver.observe(id);
        instance.isPaused = false;
      } else {
        DOMObserver.log(
          `Cannot resume observer with id "${id}": target is not in the DOM.`
        );
      }
    }
  }

  public static enableLogging(): void {
    DOMObserver.isLogging = true;
  }

  public static disableLogging(): void {
    DOMObserver.isLogging = false;
  }

  private static observe(id: string): void {
    const instance = DOMObserver.instances.get(id);
    if (instance && instance.config.target) {
      if (document.contains(instance.config.target)) {
        instance.observer.observe(
          instance.config.target,
          instance.config.config
        );
      } else {
        DOMObserver.log(
          `Cannot observe with id "${id}": target is not in the DOM.`
        );
      }
    }
  }

  private static handleMutations(
    id: string,
    config: DOMObserverConfig
  ): MutationCallback {
    const callback = createCallback(config);
    return (mutations: MutationRecord[], observer: MutationObserver) => {
      DOMObserver.updateQueue.enqueue(async () => {
        return callback(mutations, observer);
      });
    };
  }

  private static log(message: string): void {
    if (DOMObserver.isLogging) {
      console.log(`[DOMObserver] ${message}`);
    }
  }
}

export default DOMObserver;
