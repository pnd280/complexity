import throttle from "lodash/throttle";

import type {
  DomObserverConfig,
  DomObserverInstance,
  MutationCallback,
  ObserverOperation,
  Result,
} from "@/plugins/_core/dom-observers/_service/types";
import type { DomObserverId } from "@/plugins/_core/dom-observers/_service/types";
import { ExtensionSettingsService } from "@/services/infra/extension-api-wrappers/extension-settings";

export class DomObserver {
  private static instance: DomObserver;
  private DEFAULT_DEBOUNCE_TIME: number;
  private throttler;
  private debounceConfig: { leading: boolean; trailing: boolean };

  private static instances = new Map<DomObserverId, DomObserverInstance>();
  private static isLogging = false;
  private static isPaused = false; // Track the global pause state

  private constructor() {
    const isEnergySavingMode =
      ExtensionSettingsService.cachedSync.energySavingMode;

    this.DEFAULT_DEBOUNCE_TIME = isEnergySavingMode ? 500 : 50;

    this.debounceConfig = isEnergySavingMode
      ? { leading: false, trailing: true }
      : { leading: true, trailing: true };

    this.throttler = throttle;
  }

  static getInstance(): DomObserver {
    if (DomObserver.instance == null) {
      DomObserver.instance = new DomObserver();
    }
    return DomObserver.instance;
  }

  private static createError(
    code: string,
    message: string,
    context?: unknown,
  ): Result<void> {
    return {
      success: false,
      error: { code, message, context },
    };
  }

  private static createSuccess<T>(data?: T): Result<T> {
    return {
      success: true,
      data,
    };
  }

  private static validateTarget(
    target: Element | null,
    id: DomObserverId,
  ): Result<void> {
    if (!target) {
      return this.createError(
        "INVALID_TARGET",
        `Target is null for observer "${id}"`,
      );
    }
    if (!document.contains(target)) {
      return this.createError(
        "TARGET_NOT_IN_DOM",
        `Target is not in DOM for observer "${id}"`,
      );
    }
    return this.createSuccess();
  }

  private static handleOperation(operation: ObserverOperation): Result<void> {
    const { type, id, config } = operation;

    switch (type) {
      case "create":
        return this.handleCreate(id, config as DomObserverConfig);
      case "update":
        return this.handleUpdate(id, config);
      case "destroy":
        return this.handleDestroy(id);
      case "pause":
        return this.handlePause(id);
      case "resume":
        return this.handleResume(id);
      case "forceTrigger":
        return this.handleForceTrigger(id);
      default:
        return this.createError(
          "INVALID_OPERATION",
          `Invalid operation type: ${type}`,
        );
    }
  }

  private static handleCreate(
    id: DomObserverId,
    config: DomObserverConfig,
  ): Result<void> {
    if (this.instances.has(id)) {
      return this.handleUpdate(id, config);
    }

    const targetValidation = this.validateTarget(config.target, id);
    if (!targetValidation.success) return targetValidation;

    const observer = new MutationObserver(
      this.createMutationHandler(id, config),
    );
    const instance: DomObserverInstance = { observer, config, isPaused: false };

    this.instances.set(id, instance);
    this.observe(id);
    this.log(`Created observer with id "${id}"`);
    return this.createSuccess();
  }

  private static handleUpdate(
    id: DomObserverId,
    newConfig?: Partial<DomObserverConfig>,
  ): Result<void> {
    const instance = this.instances.get(id);
    if (!instance) {
      return this.createError(
        "OBSERVER_NOT_FOUND",
        `Observer with id "${id}" not found`,
      );
    }

    const updatedConfig = { ...instance.config, ...newConfig };
    const targetValidation = this.validateTarget(updatedConfig.target, id);
    if (!targetValidation.success) return targetValidation;

    instance.observer.disconnect();
    instance.observer = new MutationObserver(
      this.createMutationHandler(id, updatedConfig),
    );
    instance.config = updatedConfig;

    this.observe(id);
    this.log(`Updated observer with id "${id}"`);
    return this.createSuccess();
  }

  private static handleDestroy(id: DomObserverId): Result<void> {
    const instance = this.instances.get(id);
    if (!instance) {
      return this.createError(
        "OBSERVER_NOT_FOUND",
        `Observer with id "${id}" not found`,
      );
    }

    instance.observer.disconnect();
    this.instances.delete(id);
    this.log(`Destroyed observer with id "${id}"`);
    return this.createSuccess();
  }

  private static handlePause(id: DomObserverId): Result<void> {
    const instance = this.instances.get(id);
    if (!instance) {
      return this.createError(
        "OBSERVER_NOT_FOUND",
        `Observer with id "${id}" not found`,
      );
    }

    instance.observer.disconnect();
    instance.isPaused = true;
    this.log(`Paused observer with id "${id}"`);
    return this.createSuccess();
  }

  private static handleResume(id: DomObserverId): Result<void> {
    const instance = this.instances.get(id);
    if (!instance) {
      return this.createError(
        "OBSERVER_NOT_FOUND",
        `Observer with id "${id}" not found`,
      );
    }

    if (!instance.isPaused) {
      return this.createSuccess();
    }

    const targetValidation = this.validateTarget(instance.config.target, id);
    if (!targetValidation.success) return targetValidation;

    this.observe(id);
    instance.isPaused = false;
    this.log(`Resumed observer with id "${id}"`);
    return this.createSuccess();
  }

  private static handleForceTrigger(id: DomObserverId): Result<void> {
    const instance = this.instances.get(id);
    if (!instance) {
      return this.createError(
        "OBSERVER_NOT_FOUND",
        `Observer with id "${id}" not found`,
      );
    }

    if (instance.config.onMutation != null) {
      instance.config.onMutation();
      this.log(`Force triggered observer with id "${id}"`);
    }

    return this.createSuccess();
  }

  private static observe(id: DomObserverId): void {
    const instance = this.instances.get(id);
    if (instance?.config.target) {
      instance.observer.observe(instance.config.target, instance.config.config);
    }
  }

  private static createMutationHandler(
    id: DomObserverId,
    config: DomObserverConfig,
  ): MutationCallback {
    const instance = DomObserver.getInstance();

    const throttledCallback = instance.throttler(
      config.onMutation,
      config.debounceTime ?? instance.DEFAULT_DEBOUNCE_TIME,
      instance.debounceConfig,
    );

    throttledCallback?.();

    return throttledCallback;
  }

  private static log(message: string): void {
    if (this.isLogging) {
      console.log(`[DomObserver] ${message}`);
    }
  }

  public static initializeKeyboardShortcut(): void {
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === "Q") {
        if (this.isPaused) {
          this.resumeAll();
          this.isPaused = false;
          alert("Resumed all observers");
        } else {
          this.pauseAll();
          this.isPaused = true;
          alert("Paused all observers");
        }
      }
    });
  }

  // Public API
  public static create(
    id: DomObserverId,
    config: DomObserverConfig,
  ): Result<void> {
    return this.handleOperation({ type: "create", id, config });
  }

  public static update(
    id: DomObserverId,
    config: Partial<DomObserverConfig>,
  ): Result<void> {
    return this.handleOperation({ type: "update", id, config });
  }

  public static destroy(id: DomObserverId): Result<void> {
    return this.handleOperation({ type: "destroy", id });
  }

  public static destroyAll(): void {
    this.instances.forEach((_, id) => this.destroy(id));
  }

  public static pause(id: DomObserverId): Result<void> {
    return this.handleOperation({ type: "pause", id });
  }

  public static pauseAll(): void {
    this.instances.forEach((_, id) => this.pause(id));
    this.isPaused = true;
  }

  public static resume(id: DomObserverId): Result<void> {
    return this.handleOperation({ type: "resume", id });
  }

  public static resumeAll(): void {
    this.instances.forEach((_, id) => this.resume(id));
    this.isPaused = false;
  }

  public static forceTrigger(id: DomObserverId): Result<void> {
    return this.handleOperation({ type: "forceTrigger", id });
  }

  public static enableLogging(): void {
    this.isLogging = true;
  }

  public static disableLogging(): void {
    this.isLogging = false;
  }
}
