import type { ComponentType } from "react";

import CsUiPluginsGuard, {
  type CsUiPluginsGuardProps,
} from "@/plugins/__async-deps__/plugins-guard/CsUiPluginsGuard";

type WithPluginsGuardOptions = Omit<CsUiPluginsGuardProps, "children">;

/**
 * Higher-Order Component that wraps a component with CsUiPluginsGuard
 * @param Component - The component to be wrapped
 * @param options - Guard conditions and additional options
 */
export function withPluginsGuard<P extends object>(
  Component: ComponentType<P>,
  options: WithPluginsGuardOptions,
) {
  const displayName = Component.displayName || Component.name || "Component";

  function WithPluginsGuard(props: P) {
    return (
      <CsUiPluginsGuard {...options}>
        <Component {...props} />
      </CsUiPluginsGuard>
    );
  }

  WithPluginsGuard.displayName = `withPluginsGuard(${displayName})`;

  return WithPluginsGuard;
}
