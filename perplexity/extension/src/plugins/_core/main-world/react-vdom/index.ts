import registerProxyService from "@/plugins/_core/main-world/react-vdom/service/service-init";

declare module "@/plugins/_core/main-world/types" {
  interface MainWorldCorePluginRegistry {
    reactVdom: void;
  }
}

onlyMainWorldGuard();

registerProxyService();
