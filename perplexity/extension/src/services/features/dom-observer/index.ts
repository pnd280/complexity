import type {
  SubscriptionOptions,
  Subscription,
  SelectorCallbackData,
  ProcessingType,
} from "@/services/features/dom-observer/types";

export class DomObserver {
  private static readonly MAX_PROCESSING_TIME_MS = 4;
  private static readonly FALLBACK_TIMEOUT_MS = 0;
  private static readonly INACTIVE_TAB_THROTTLE_MS = 100; // Throttle to 10fps when inactive
  private static readonly INACTIVE_TAB_MAX_PROCESSING_TIME_MS = 2;

  private observer: MutationObserver;
  private isTabVisible = true;
  private elementData = new WeakMap<
    Element,
    { subs: (string | number)[]; [key: string]: any }
  >();

  private selectorCallbacks = new Map<string, SelectorCallbackData>();

  private idToSelectorMap = new Map<string | number, string | string[]>();

  private subscriptions = new Map<string | number, Subscription>();

  private pendingAddedNodes: Element[] = [];

  private pendingRemovedNodes: Element[] = [];

  private isProcessing = false;

  /**
   * Fast check to prevent processing extension-injected elements.
   * This is the PRIMARY defense against infinite loops.
   */
  private isExtensionElement(element: Element): boolean {
    // Ultra-fast attribute check first
    if (element.hasAttribute("data-cplx-component")) {
      return true;
    }

    // Fast ancestor check using closest()
    return element.closest("[data-cplx-component]") !== null;
  }

  constructor() {
    this.observer = new MutationObserver(this.queueMutations.bind(this));
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.setupVisibilityTracking();
  }

  /**
   * Temporarily pause the observer to prevent recursive mutations.
   */
  pause(): void {
    this.observer.disconnect();
  }

  /**
   * Resume the observer after DOM modifications are complete.
   */
  resume(): void {
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private setupVisibilityTracking(): void {
    if (typeof document.visibilityState !== "undefined") {
      this.isTabVisible = document.visibilityState === "visible";

      const handleVisibilityChange = () => {
        this.isTabVisible = document.visibilityState === "visible";
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
    }
  }

  private scheduleProcessing(): void {
    if (
      this.isTabVisible &&
      typeof window.requestAnimationFrame === "function"
    ) {
      requestAnimationFrame(this.processNodes.bind(this));
    } else {
      const delay = this.isTabVisible
        ? DomObserver.FALLBACK_TIMEOUT_MS
        : DomObserver.INACTIVE_TAB_THROTTLE_MS;
      setTimeout(this.processNodes.bind(this), delay);
    }
  }

  /**
   * Subscribes to DOM mutations for a given CSS selector or array of selectors.
   *
   * @param options - Subscription options including id, selector(s), and callbacks
   * @returns A function to call to unsubscribe.
   */
  subscribe({
    id,
    selector,
    onAdd,
    onRemove,
    existingCheck = false,
    once = false,
  }: SubscriptionOptions): () => void {
    if (this.subscriptions.has(id)) {
      throw new Error(`Subscription with id "${id}" already exists`);
    }

    const subscriptionDetails: Subscription = {
      id,
      selector,
      onAdd,
      onRemove,
      once,
      triggeredCallbacks: once ? new Set() : undefined,
    };
    this.subscriptions.set(id, subscriptionDetails);

    this.idToSelectorMap.set(id, selector);

    const selectors = Array.isArray(selector) ? selector : [selector];

    // Register callbacks for each selector
    for (const singleSelector of selectors) {
      if (!this.selectorCallbacks.has(singleSelector)) {
        this.selectorCallbacks.set(singleSelector, {
          onAdd: [],
          onRemove: [],
          refCount: 0,
        });
      }
      const callbacksForSelector = this.selectorCallbacks.get(singleSelector)!;
      callbacksForSelector.refCount++;
      if (typeof onAdd === "function") {
        callbacksForSelector.onAdd.push(onAdd);
      }
      if (typeof onRemove === "function") {
        callbacksForSelector.onRemove.push(onRemove);
      }
    }

    // Check existing elements for each selector
    for (const singleSelector of selectors) {
      try {
        const existingElements = document.querySelectorAll(singleSelector);
        for (const element of existingElements) {
          this.processExistingElement(
            element,
            id,
            subscriptionDetails,
            existingCheck,
          );
        }
      } catch (e) {
        console.error(
          `Error with selector during initial check: "${singleSelector}"`,
          e,
        );
      }
    }

    return () => this.unsubscribe(id);
  }

  /**
   * Checks if a "once" subscription should be auto-unsubscribed.
   * @param subscription - The subscription to check.
   * @returns True if the subscription should be unsubscribed.
   */
  private shouldAutoUnsubscribe(subscription: Subscription): boolean {
    if (!subscription.once || !subscription.triggeredCallbacks) {
      return false;
    }

    const hasOnAdd = typeof subscription.onAdd === "function";
    const hasOnRemove = typeof subscription.onRemove === "function";

    if (hasOnAdd && hasOnRemove) {
      return (
        subscription.triggeredCallbacks.has("onAdd") &&
        subscription.triggeredCallbacks.has("onRemove")
      );
    }

    if (hasOnAdd) {
      return subscription.triggeredCallbacks.has("onAdd");
    }

    if (hasOnRemove) {
      return subscription.triggeredCallbacks.has("onRemove");
    }

    return false;
  }

  /**
   * Unsubscribes from DOM mutations for a given subscription ID.
   *
   * @param id - The ID of the subscription to remove.
   */
  unsubscribe(id: string | number): void {
    if (!this.subscriptions.has(id)) {
      return;
    }

    const subscription = this.subscriptions.get(id)!;
    const selector = subscription.selector;

    this.subscriptions.delete(id);
    this.idToSelectorMap.delete(id);

    const selectors = Array.isArray(selector) ? selector : [selector];

    for (const singleSelector of selectors) {
      const callbacksForSelector = this.selectorCallbacks.get(singleSelector);
      if (callbacksForSelector) {
        callbacksForSelector.refCount--;

        if (typeof subscription.onAdd === "function") {
          const addIndex = callbacksForSelector.onAdd.indexOf(
            subscription.onAdd,
          );
          if (addIndex > -1) {
            callbacksForSelector.onAdd.splice(addIndex, 1);
          }
        }
        if (typeof subscription.onRemove === "function") {
          const removeIndex = callbacksForSelector.onRemove.indexOf(
            subscription.onRemove,
          );
          if (removeIndex > -1) {
            callbacksForSelector.onRemove.splice(removeIndex, 1);
          }
        }

        if (callbacksForSelector.refCount === 0) {
          this.selectorCallbacks.delete(singleSelector);
        }
      }
    }
  }

  private queueMutations(mutationsList: MutationRecord[]): void {
    for (let i = 0; i < mutationsList.length; i++) {
      const mutation = mutationsList[i];
      if (!mutation) continue;

      // Filter added nodes
      const addedNodes = mutation.addedNodes;
      for (let j = 0; j < addedNodes.length; j++) {
        const node = addedNodes[j];
        if (node && node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;

          // CRITICAL: Skip extension elements to prevent infinite loops
          if (!this.isExtensionElement(element)) {
            this.pendingAddedNodes.push(element);
          }
        }
      }

      // Filter removed nodes
      const removedNodes = mutation.removedNodes;
      for (let j = 0; j < removedNodes.length; j++) {
        const node = removedNodes[j];
        if (node && node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;

          // Skip extension elements for removals too
          if (!this.isExtensionElement(element)) {
            this.pendingRemovedNodes.push(element);
          }
        }
      }
    }

    if (!this.isProcessing) {
      this.isProcessing = true;
      this.scheduleProcessing();
    }
  }

  private processNodes(): void {
    if (
      this.pendingAddedNodes.length === 0 &&
      this.pendingRemovedNodes.length === 0
    ) {
      this.isProcessing = false;
      return;
    }

    const startTime = performance.now();
    const maxProcessTime = this.isTabVisible
      ? DomObserver.MAX_PROCESSING_TIME_MS
      : DomObserver.INACTIVE_TAB_MAX_PROCESSING_TIME_MS;

    // Process removals FIRST to maintain logical order (removals happen before additions)
    while (
      this.pendingRemovedNodes.length > 0 &&
      performance.now() - startTime < maxProcessTime
    ) {
      const node = this.pendingRemovedNodes.pop()!;
      this.processNodeAndDescendants(node, "remove");
    }

    // Then process additions if time allows in this time frame
    while (
      this.pendingAddedNodes.length > 0 &&
      performance.now() - startTime < maxProcessTime
    ) {
      const node = this.pendingAddedNodes.pop()!;
      this.processNodeAndDescendants(node, "add");
    }

    // Continue if more work remains
    if (
      this.pendingAddedNodes.length > 0 ||
      this.pendingRemovedNodes.length > 0
    ) {
      this.scheduleProcessing();
    } else {
      this.isProcessing = false;
    }
  }

  /**
   * Processes a single node and its descendants against all active selectors.
   * @param node - The node to process.
   * @param type - The type of processing (add or remove).
   */
  private processNodeAndDescendants(node: Element, type: ProcessingType): void {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    if (type === "add") {
      const checkAndProcessElement = (element: Element): void => {
        if (element == null) {
          return;
        }

        for (const selector of this.selectorCallbacks.keys()) {
          try {
            if (element.matches(selector)) {
              for (const [
                subscriptionId,
                subscription,
              ] of this.subscriptions.entries()) {
                const subscriptionSelectors = Array.isArray(
                  subscription.selector,
                )
                  ? subscription.selector
                  : [subscription.selector];

                if (subscriptionSelectors.includes(selector)) {
                  this.processElementForSubscription(
                    element,
                    subscriptionId,
                    subscription,
                    type,
                  );
                }
              }
            }
          } catch (e) {
            console.error(`Error matching selector "${selector}":`, e);
          }
        }
      };

      checkAndProcessElement(node);

      const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_ELEMENT,
        null, // No custom filter needed, all elements will be checked against all selectors
      );

      let currentNode = walker.nextNode() as Element | null;
      while (currentNode) {
        checkAndProcessElement(currentNode);
        currentNode = walker.nextNode() as Element | null;
      }
    } else {
      this.processRemovedNodeAndDescendants(node);
    }
  }

  /**
   * Processes a single element that already exists at the time of subscription.
   * This ensures onRemove works and optionally triggers onAdd.
   * @param element - The element to process.
   * @param subscriptionId - The unique subscription ID.
   * @param subscription - The subscription object with callbacks.
   * @param existingCheck - If true, fire onAdd callback.
   */
  private processExistingElement(
    element: Element,
    subscriptionId: string | number,
    subscription: Subscription,
    existingCheck: boolean,
  ): void {
    let data = this.elementData.get(element);
    if (!data) {
      data = { subs: [] };
      this.elementData.set(element, data);
    }

    const trackingKey = `onAdd.${subscriptionId}`;

    if (data[trackingKey] === true) {
      return;
    }

    data[trackingKey] = true;

    data.subs.push(subscriptionId);

    if (existingCheck && typeof subscription.onAdd === "function") {
      subscription.onAdd(element);

      if (subscription.once && subscription.triggeredCallbacks) {
        subscription.triggeredCallbacks.add("onAdd");

        if (this.shouldAutoUnsubscribe(subscription)) {
          // Schedule unsubscribe after current processing to avoid iterator issues
          setTimeout(() => this.unsubscribe(subscriptionId), 0);
        }
      }
    }
  }

  /**
   * Processes removed nodes based on tracking data.
   * @param node - The removed node to process.
   */
  private processRemovedNodeAndDescendants(node: Element): void {
    const data = this.elementData.get(node);
    if (data?.subs) {
      for (const subscriptionId of data.subs) {
        const subscription = this.subscriptions.get(subscriptionId);
        if (subscription) {
          this.processElementForSubscription(
            node,
            subscriptionId,
            subscription,
            "remove",
          );
        }
      }
    }

    if (node.children?.length) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child) {
          this.processRemovedNodeAndDescendants(child);
        }
      }
    }
  }

  /**
   * Processes a single element for a specific subscription, checking if it's already been processed.
   * @param element - The element to process.
   * @param subscriptionId - The unique subscription ID.
   * @param subscription - The subscription object with callbacks.
   * @param type - The type of processing (add or remove).
   */
  private processElementForSubscription(
    element: Element,
    subscriptionId: string | number,
    subscription: Subscription,
    type: ProcessingType,
  ): void {
    if (type === "add") {
      let data = this.elementData.get(element);
      if (!data) {
        data = { subs: [] };
        this.elementData.set(element, data);
      }

      const trackingKey = `onAdd.${subscriptionId}`;

      if (data[trackingKey] === true) {
        return;
      }

      data[trackingKey] = true;

      data.subs.push(subscriptionId);

      if (typeof subscription.onAdd === "function") {
        subscription.onAdd(element);

        if (subscription.once && subscription.triggeredCallbacks) {
          subscription.triggeredCallbacks.add("onAdd");
        }
      }
    } else {
      const data = this.elementData.get(element);
      const wasTracked = Boolean(data?.subs?.includes(subscriptionId));

      if (wasTracked && typeof subscription.onRemove === "function") {
        subscription.onRemove(element);

        if (subscription.once && subscription.triggeredCallbacks) {
          subscription.triggeredCallbacks.add("onRemove");
        }
      }
    }

    if (this.shouldAutoUnsubscribe(subscription)) {
      setTimeout(() => this.unsubscribe(subscriptionId), 0);
    }
  }
}

export const domObserverService = new DomObserver();
