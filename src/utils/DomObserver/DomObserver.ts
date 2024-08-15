import {
  DomObserverConfig,
  DomObserverInstance,
  MutationCallback,
} from "@/types/dom-observer.types";
import { createCallback } from "@/utils/DomObserver/callback-factory";
import { TaskQueue } from "@/utils/TaskQueue";

export default class DomObserver {
  private static instances: Map<string, DomObserverInstance> = new Map();
  private static isLogging = false;
  public static updateQueue: TaskQueue = TaskQueue.getInstance();

  public static create(id: string, config: DomObserverConfig): void {
    if (DomObserver.instances.has(id)) {
      DomObserver.update(id, config);
      return;
    }

    const observer = new MutationObserver(
      DomObserver.handleMutations(id, config),
    );
    const instance: DomObserverInstance = { observer, config, isPaused: false };

    if (!config.source) {
      config.source = "default";
    }

    DomObserver.instances.set(id, instance);
    DomObserver.observe(id);
    DomObserver.log(`Created observer with id "${id}"`);
  }

  public static update(
    id: string,
    newConfig: Partial<DomObserverConfig>,
  ): void {
    const instance = DomObserver.instances.get(id);
    if (!instance) {
      DomObserver.log(`Observer with id "${id}" not found.`);
      return;
    }

    instance.config = { ...instance.config, ...newConfig };
    instance.observer.disconnect();
    instance.observer = new MutationObserver(
      DomObserver.handleMutations(id, instance.config),
    );
    DomObserver.observe(id);
    DomObserver.log(`Updated observer with id "${id}"`);
  }

  public static destroy(id: string): void {
    const instance = DomObserver.instances.get(id);
    if (instance) {
      instance.observer.disconnect();
      DomObserver.instances.delete(id);
      DomObserver.log(`Destroyed observer with id "${id}"`);
    }
  }

  public static destroyAll(source?: DomObserverConfig["source"]): void {
    DomObserver.instances.forEach((instance, id) => {
      if (instance.config.source === source || !source) {
        DomObserver.destroy(id);
      }
    });
  }

  public static pause(id: string): void {
    const instance = DomObserver.instances.get(id);
    if (instance) {
      instance.observer.disconnect();
      instance.isPaused = true;
      DomObserver.log(`Paused observer with id "${id}"`);
    }
  }

  public static pauseAll(): void {
    for (const id of DomObserver.instances.keys()) {
      DomObserver.pause(id);
    }
  }

  public static resume(id: string): void {
    const instance = DomObserver.instances.get(id);
    if (instance && instance.isPaused) {
      if (instance.config.target && document.contains(instance.config.target)) {
        DomObserver.observe(id);
        instance.isPaused = false;
      } else {
        DomObserver.log(
          `Cannot resume observer with id "${id}": target is not in the Dom.`,
        );
      }
    }
  }

  public static enableLogging(): void {
    DomObserver.isLogging = true;
  }

  public static disableLogging(): void {
    DomObserver.isLogging = false;
  }

  private static observe(id: string): void {
    const instance = DomObserver.instances.get(id);
    if (instance && instance.config.target) {
      if (document.contains(instance.config.target)) {
        instance.observer.observe(
          instance.config.target,
          instance.config.config,
        );
      } else {
        DomObserver.log(
          `Cannot observe with id "${id}": target is not in the Dom.`,
        );
      }
    }
  }

  private static handleMutations(
    id: string,
    config: DomObserverConfig,
  ): MutationCallback {
    const callback = createCallback(config);
    return (mutations: MutationRecord[], observer: MutationObserver) => {
      callback(mutations, observer);
    };
  }

  private static log(message: string): void {
    if (DomObserver.isLogging) {
      console.log(`[DomObserver] ${message}`);
    }
  }
}
