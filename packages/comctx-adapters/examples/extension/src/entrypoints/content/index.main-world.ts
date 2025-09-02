// INJECTED SCRIPT

import { DocumentAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import type { CounterService } from "@/services/counter";

(async () => {
  const [, getService] = defineProxy(() => ({}) as CounterService, {
    namespace: "counter",
  });

  const counterService = getService(new DocumentAdapter("counter"));

  console.log("object", await counterService.object());
  console.log("string", await counterService.string());
  console.log("number", await counterService.number());
  console.log("boolean", await counterService.boolean());
  console.log("array", await counterService.array());
})();
