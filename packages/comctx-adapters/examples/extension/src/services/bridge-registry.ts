import {
  TabConsumerAdapter,
  BrowserRuntimeAdapter,
} from "@comctx-adapters/core";
import { defineProxy } from "comctx";

export class BridgeRegistryService {
  private registeredServices = new Set<string>();
  private verbose: boolean;

  constructor(options: { verbose?: boolean } = {}) {
    this.verbose = options.verbose ?? false;
  }

  private log(message: string): void {
    if (this.verbose) {
      console.log(`[BridgeRegistry] ${message}`);
    }
  }

  /**
   * Register a bridge service for a tab and namespace
   * @param params The registration parameters
   * @param params.tabId The tab ID
   * @param params.namespace The service namespace
   * @returns true if registered successfully, false if already exists
   */
  register({
    tabId,
    namespace,
  }: {
    tabId: number;
    namespace: string;
  }): boolean {
    const serviceKey = `${tabId}:${namespace}`;

    // Check if already registered
    if (this.registeredServices.has(serviceKey)) {
      this.log(`Bridge service already registered: ${serviceKey}`);
      return false;
    }

    // Register the service
    this.registeredServices.add(serviceKey);

    const [, getService] = defineProxy(() => ({}), {
      namespace,
    });

    const service = getService(new TabConsumerAdapter({ tabId }));

    const [registerBridgeService] = defineProxy(() => service, {
      namespace,
    });

    registerBridgeService(new BrowserRuntimeAdapter());

    this.log(`Successfully registered bridge service: ${serviceKey}`);
    return true;
  }

  /**
   * Get all registered service keys (for debugging)
   */
  getRegisteredServices(): string[] {
    return Array.from(this.registeredServices);
  }

  /**
   * Check if a service is already registered
   * @param params The check parameters
   * @param params.tabId The tab ID
   * @param params.namespace The service namespace
   */
  isRegistered({
    tabId,
    namespace,
  }: {
    tabId: number;
    namespace: string;
  }): boolean {
    const serviceKey = `${tabId}:${namespace}`;
    return this.registeredServices.has(serviceKey);
  }
}
