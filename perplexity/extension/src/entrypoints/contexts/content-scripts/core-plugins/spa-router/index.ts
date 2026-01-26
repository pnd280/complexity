import registerProxyService from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/service/service-init";
import { proxySpaRouter } from "@/entrypoints/contexts/content-scripts/core-plugins/spa-router/spa-router";

proxySpaRouter();
registerProxyService();
