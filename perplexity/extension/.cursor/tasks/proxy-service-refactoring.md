# Proxy Service Pattern Refactoring

### Step 1: Consolidate Service Implementation

- **Delete** the separate `get-service.ts` file (if it exists)
- **Modify** the main service file (`index.ts` or service implementation file):
  - Change the class name from `ServiceName` to `ServiceNameImpl`
  - Convert all instance methods to static methods (optional, if the service has no instance methods)
  - Add a type export: `export type ServiceName = typeof ServiceNameImpl;`

### Step 2: Consolidate Proxy Files

- **Delete** the separate `proxy-register.bg-worker.ts` file
- **Delete** the separate `proxy.ts` file
- **Create** a new `service-init.bg-worker.ts` file that combines both:
  - Import both `defineProxy` and service implementation
  - Create a single `defineProxy` call with `backup: false` option
  - Export both `getRootService()` and `getProxyService()` functions
  - Export a unified `getService()` function that chooses based on context (optional, if the service has the `get-service.ts` file)
  - Export the default registration function

### Step 3: Update Service Implementation Pattern

- If possible, prioritize changing from instance-based to static class pattern:

  ```typescript
  // Before
  export class ServiceName {
    async method() { ... }
  }

  // After
  export class ServiceNameImpl {
    static async method() { ... }
  }
  export type ServiceName = typeof ServiceNameImpl;
  ```

### Step 4: Update Proxy Pattern

- Combine the proxy registration and access into one file:
  ```typescript
  const [registerService, getService] = defineProxy(getRootService, {
    namespace: backgroundProxyServiceName,
  });
  ```

### Step 5: File Structure Changes

For each service, go from:

```
service/
├── index.ts (service implementation)
├── get-service.ts (service getter)
├── proxy-register.bg-worker.ts (registration)
└── proxy.ts (proxy access)
```

To:

```
service/
├── index.ts (service implementation)
└── service-init.bg-worker.ts (combined proxy logic)
```

This refactor reduces each service from 4 files to 2 files and eliminates the need for separate proxy registration and access files.

## Full Example

```typescript
import { BrowserRuntimeAdapter } from "@comctx-adapters/core";
import { defineProxy } from "comctx";

import {
  backgroundProxyServiceName,
  QueryCacheServiceImpl,
  type QueryCacheService,
} from "@/data/query-client/indexed-db";
import { isBackgroundScript } from "@/utils/utils";

let rootServiceInstance: QueryCacheService | undefined;
let proxyServiceInstance: QueryCacheService | undefined;

const [registerService, getService] = defineProxy(getQueryCacheRootService, {
  namespace: backgroundProxyServiceName,
  backup: false,
});

export function getQueryCacheRootService(): QueryCacheService {
  invariant(
    isBackgroundScript(),
    "This method is only allowed in background script, use getQueryCacheProxyService instead.",
  );

  rootServiceInstance ??= QueryCacheServiceImpl;

  return rootServiceInstance;
}

export function getQueryCacheProxyService(): QueryCacheService {
  invariant(
    !isBackgroundScript(),
    "Use getQueryCacheRootService to access the non-proxied instance in background script.",
  );

  proxyServiceInstance ??= getService(new BrowserRuntimeAdapter());

  return proxyServiceInstance;
}

export function getQueryCacheService(): QueryCacheService {
  return isBackgroundScript()
    ? getQueryCacheRootService()
    : getQueryCacheProxyService();
}

export default function () {
  registerService(new BrowserRuntimeAdapter());
}
```
