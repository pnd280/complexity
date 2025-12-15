import type { GuardCheckParams } from "@/entrypoints/contexts/content-scripts/services/ui-guard/guards";
import { Logger } from "@/utils/misc/context-logger";

/**
 * Global error manager for deduplicating error dialogs
 * Ensures only one error dialog is shown per component type
 */
class ErrorDialogManager {
  private static logger = new Logger("UiGuard:ErrorManager");
  private activeErrors = new Map<string, boolean>();
  private errorCallbacks = new Map<string, Set<() => void>>();

  /**
   * Check if an error dialog is already active for a component
   */
  isErrorActive(componentKey: string): boolean {
    return this.activeErrors.get(componentKey) === true;
  }

  /**
   * Register an error for a component and get whether this instance should show the dialog
   * @param componentKey - Unique key identifying the component type
   * @param onClose - Callback when the error dialog is closed
   * @returns true if this instance should show the dialog, false otherwise
   */
  registerError(componentKey: string, onClose: () => void): boolean {
    const isAlreadyActive = this.isErrorActive(componentKey);

    // Add the callback to the set of callbacks for this component
    if (!this.errorCallbacks.has(componentKey)) {
      this.errorCallbacks.set(componentKey, new Set());
    }
    this.errorCallbacks.get(componentKey)!.add(onClose);

    if (!isAlreadyActive) {
      // Mark this component as having an active error
      this.activeErrors.set(componentKey, true);
      return true; // This instance should show the dialog
    }

    return false; // Don't show dialog, another instance is already showing it
  }

  /**
   * Clear the error state for a component and notify all instances
   */
  clearError(componentKey: string): void {
    this.activeErrors.set(componentKey, false);

    // Notify all registered callbacks
    const callbacks = this.errorCallbacks.get(componentKey);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback();
        } catch (error) {
          ErrorDialogManager.logger.error(
            "Error in error dialog callback:",
            error,
          );
        }
      });
      callbacks.clear();
    }
  }

  /**
   * Unregister a callback for a component
   */
  unregisterCallback(componentKey: string, onClose: () => void): void {
    const callbacks = this.errorCallbacks.get(componentKey);
    if (callbacks) {
      callbacks.delete(onClose);
    }
  }

  /**
   * Generate a component key based on component information
   */
  generateComponentKey(props: {
    dependentPluginIds?: string[];
    location?: GuardCheckParams["currentLocation"][];
    customMessage?: string;
    errorMessage?: string;
  }): string {
    const { dependentPluginIds, location, customMessage } = props;

    // Create a unique key based on the component's identifying characteristics
    const keyParts = [
      dependentPluginIds?.sort().join(",") || "no-deps",
      location
        ?.map((l) => (typeof l === "string" ? l : JSON.stringify(l)))
        .join(",") || "no-location",
      customMessage || "no-custom-message",
    ];

    return keyParts.join("|");
  }
}

// Export a singleton instance
export const errorDialogManager = new ErrorDialogManager();
