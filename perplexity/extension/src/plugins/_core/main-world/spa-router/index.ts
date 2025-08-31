import registerProxyService from "@/plugins/_core/main-world/spa-router/service/proxy-register";
import { proxySpaRouter } from "@/plugins/_core/main-world/spa-router/spa-router";

declare module "@/plugins/_core/main-world/types" {
  interface MainWorldCorePluginRegistry {
    spaRouter: void;
  }
}

onlyMainWorldGuard();

proxySpaRouter();
registerProxyService();
