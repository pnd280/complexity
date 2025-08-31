import { allowWindowMessaging } from "webext-bridge/content-script";

import { PluginRegistry } from "@/data/plugin-registry";
import type {
  PluginId,
  PluginsSettingsRegistry,
} from "@/data/plugin-registry/types";
import { InternalWebSocketManager } from "@/plugins/_api/web-socket/internal-web-socket-manager";
import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { internalWebSocketStore } from "@/plugins/_core/global-stores/web-socket";
import type { MainWorldCorePluginId } from "@/plugins/_core/main-world/types";
import { injectMainWorldScript } from "@/utils/utils";

import markmapRendererPlugin from "@/plugins/_core/main-world/markmap-renderer?script&module";
import mermaidRendererPlugin from "@/plugins/_core/main-world/mermaid-renderer/index?script&module";
import networkInterceptPlugin from "@/plugins/_core/main-world/network-intercept/index?script&module";
import reactVdomPlugin from "@/plugins/_core/main-world/react-vdom/index?script&module";
import spaRouterPlugin from "@/plugins/_core/main-world/spa-router/index?script&module";
import webextBridgeSetNamespace from "@/plugins/_core/main-world/webext-bridge?script&module";
import jqueryExtensions from "@/utils/jquery.extensions?script&module";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugins:mainWorldCorePlugins": void;
    "plugins:mainWorldCorePlugins:domSelectorsDependants": void;
  }
}

export default function () {
  allowWindowMessaging("com.complexity.perplexity");

  asyncLoaderRegistry.register({
    id: "plugins:mainWorldCorePlugins",
    dependencies: ["cache:pluginsStates"],
    loader: async ({ "cache:pluginsStates": pluginsStates }) => {
      await injectMainWorldScript({
        url: chrome.runtime.getURL(webextBridgeSetNamespace),
      });

      injectMainWorldScript({
        url: chrome.runtime.getURL(jqueryExtensions),
        head: true,
        inject: true,
      });

      injectMainWorldScript({
        url: chrome.runtime.getURL(networkInterceptPlugin),
        head: true,
        inject: shouldEnable("networkIntercept", pluginsStates),
      });

      if (shouldEnable("webSocket", pluginsStates)) {
        InternalWebSocketManager.getInstance()
          .handShake()
          .then((socket) => {
            internalWebSocketStore.setState({
              common: socket,
            });
          });
      }
    },
  });

  asyncLoaderRegistry.register({
    id: "plugins:mainWorldCorePlugins:domSelectorsDependants",
    dependencies: ["cache:pluginsStates", "cache:domSelectors"],
    loader: async ({ "cache:pluginsStates": pluginsStates }) => {
      injectMainWorldScript({
        url: chrome.runtime.getURL(spaRouterPlugin),
        head: true,
        inject: shouldEnable("spaRouter", pluginsStates),
      });

      injectMainWorldScript({
        url: chrome.runtime.getURL(reactVdomPlugin),
        head: true,
        inject: shouldEnable("reactVdom", pluginsStates),
      });

      injectMainWorldScript({
        url: chrome.runtime.getURL(mermaidRendererPlugin),
        head: true,
        inject: shouldEnable("mermaidRenderer", pluginsStates),
      });

      injectMainWorldScript({
        url: chrome.runtime.getURL(markmapRendererPlugin),
        head: true,
        inject: shouldEnable("markmapRenderer", pluginsStates),
      });
    },
  });
}

function shouldEnable(
  corePluginId: MainWorldCorePluginId,
  pluginsStates: Record<keyof PluginsSettingsRegistry, boolean>,
) {
  const shouldInject = Object.entries(pluginsStates).some(
    ([pluginId, enabled]) => {
      if (!enabled) return false;

      const pluginManifest = PluginRegistry.manifests[pluginId as PluginId];
      if (!pluginManifest?.dependentMainWorldCorePlugins) return false;

      return pluginManifest.dependentMainWorldCorePlugins.includes(
        corePluginId,
      );
    },
  );

  return shouldInject;
}
