import type { ComponentType } from "react";

import CsUiGuard, {
  type CsUiGuardProps,
} from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";

type WithPluginsGuardOptions = Omit<CsUiGuardProps, "children">;

/**
 * Higher-Order Component that wraps a component with CsUiGuard
 * @param Component - The component to be wrapped
 * @param options - Guard conditions and additional options
 */
export function withCsUiGuard<P extends object>(
  Component: ComponentType<P>,
  options: WithPluginsGuardOptions,
) {
  const displayName = Component.displayName || Component.name || "Component";

  function WithPluginsGuard(props: P) {
    return (
      <CsUiGuard {...options}>
        <Component {...props} />
      </CsUiGuard>
    );
  }

  WithPluginsGuard.displayName = `withCsUiGuard(${displayName})`;

  return WithPluginsGuard;
}
