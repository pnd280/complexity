import { PluginRegistry } from "@/data/plugin-registry";
import type {
  PluginId,
  TypedPluginManifest,
} from "@/data/plugin-registry/types";
import type { CoreDomObserverId } from "@/plugins/_core/dom-observers/types";
import { PluginsStatesService } from "@/services/features/plugins-states";

export function shouldEnableCoreObserver({
  coreObserverId,
}: {
  coreObserverId: CoreDomObserverId;
}) {
  const pluginsStates = PluginsStatesService.getEnableStatesCachedSync();

  return Object.entries(PluginRegistry.manifests).some((entry) => {
    const [pluginId, pluginManifest] = entry as [
      PluginId,
      TypedPluginManifest<PluginId>,
    ];

    const isPluginEnabled = pluginsStates[pluginId];

    const haveObserverAsDirectDependency =
      pluginManifest.dependentDomObservers?.includes(coreObserverId);

    const haveObserverAsChildDependency =
      pluginManifest.dependentDomObservers?.find((dependency) =>
        dependency.startsWith(coreObserverId),
      ) != null;

    return (
      isPluginEnabled &&
      (haveObserverAsDirectDependency || haveObserverAsChildDependency)
    );
  });
}

export function isInternalNodeExists({
  node,
  selector,
}: {
  node?: HTMLElement;
  selector?: string;
}) {
  if (node == null) return false;

  if (!document.body.contains(node)) return false;

  if (selector != null && !node.matches(selector)) return false;

  return true;
}
