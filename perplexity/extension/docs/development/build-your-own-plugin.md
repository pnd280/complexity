# Build Your Own Plugin

> [!IMPORTANT]
> PR for new plugins/features are NOT accepted. If you'd like to add a new feature, please open an issue first.

## Prerequisites

- Read [Architecture](./architecture.md) for contexts and boundaries understanding
- [Development environment](./dx.md) ready

## Plugin Anatomy

### Directory Structure

Each plugin follows a feature-based structure in its own directory:

```
src/plugins/your-plugin-name/
├── components/                       # UI components
├── hooks/                            # React hooks
├── index.manifest.ts[*]              # Entry point and registration
├── index.loader.ts[*]                # Main content script loader
├── settings-ui.opt-loader.tsx[*]     # Settings UI registration
├── settings.ts                       # Settings schemas and storage
├── permissions.ts                    # Permissions definition
├── store.ts                          # State management (Zustand)
├── utils.ts                          # Utility functions
├── types.ts                          # Type definitions
└── **/*.public.ts[*]                 # Public exports
```

> [!IMPORTANT]
> `[*]` Exact naming required for auto-discovery.

> [!TIP]
> use `_<group>` folder naming to group related plugins

### Discovery & Registration

Plugins are **automatically discovered** via Vite's `import.meta.glob` and TypeScript module augmentation:

1. **Create directory** under `src/plugins/your-plugin-name/`
2. **Add `index.manifest.ts`** with plugin registration and type augmentation
3. **No manual registration** required - system auto-detects valid patterns and integrates

## Execution Contexts & Entrypoints

### Where Your Code Runs

- **Background**: For background listeners, use when `chrome.api/*` is required
- **Content Scripts**: DOM manipulation, UI injection/modification (via `index.loader.ts`)
- **Main-world**: Access to page's React fiber tree or other page-specific APIs (via `injectMainWorldScript`)
- **Extension's Settings Dashboard**: Only use for Settings panels registration (via `settings-ui.opt-loader.tsx`)

### Typical Plugin Flow

1. **Register** plugin in `index.manifest.ts`
2. **Define** settings in `settings.ts` and UI in `settings-ui.opt-loader.tsx`
3. **Load** logic using [context loaders](./context-loaders.md)
   - **Observe** page events (routing, DOM changes)
   - **Inject** UI components into Perplexity pages (prioritize React, use the existing design system)
   - **Store** local state using Zustand, Extension Storage or IndexedDb for persistent storage

## Core APIs (Observer Pattern)

The extension provides abstracted APIs following the **Observer Pattern**:

### Network Interception

- **Block requests/responses**
- **Log network traffic**
- **Modify request/response payloads**

### Page Observation

- **Router events** - Navigate between Perplexity pages
- **DOM elements** - Query boxes, homepage, threads, etc. elements
- **React fiber tree** - Extract data not rendered as HTML elements

## Scaffold a Plugin

> [!TIP]
> It's highly recommended to explore the existing plugins in `src/plugins/` to understand the patterns and observable resources (DOM elements, internal states, etc.).

### 1. Directory Structure

Create a new folder in `src/plugins/` (e.g., `my-feature`).

### 2. Plugin Registration (`index.manifest.ts`)

```typescript
import {
  definePluginDashboardMeta,
  definePluginDependencies,
  definePluginMeta,
} from "@/entrypoints/services/plugins/defines";
import type { PluginManifestExports } from "@/entrypoints/services/plugins/types";
import { permissions } from "./permissions";
import { settingsSchemas, settingsStorage } from "./settings";

declare module "@/entrypoints/services/plugins/types" {
  interface PluginsRegistry {
    [meta.id]: typeof manifest;
  }
}

const meta = definePluginMeta({
  id: "myFeature",
  name: "My Feature",
  description: "Description of my feature",
  devOnly: true, // Set to false when ready
});

const dashboardMeta = definePluginDashboardMeta({
  tags: ["ui"],
  categories: ["misc"],
  uiRouteSegment: "my-feature",
});

const manifest = {
  meta,
  dashboardMeta,
  settingsSchemas,
  settingsStorage,
  permissions,
} satisfies PluginManifestExports;

export default manifest;
```

### 3. Settings (`settings.ts`)

Define your settings schema and storage.

### 4. Logic (`index.loader.ts`)

```typescript
import { AsyncLoaderRegistry } from "@/entrypoints/contexts/content-scripts/services/async-loaders";

declare module "@/entrypoints/contexts/content-scripts/services/async-loaders" {
  interface AsyncLoadersRegistry {
    "myFeature:main": void;
  }
}

export default function () {
  AsyncLoaderRegistry.register({
    id: "myFeature:main",
    dependencies: ["cache:pluginsEnableStatesV2"],
    loader: async ({ "cache:pluginsEnableStatesV2": pluginsEnableStates }) => {
      if (!pluginsEnableStates["myFeature"]) return;

      // Your plugin logic here
      console.log("My Feature is running!");
    },
  });
}
```

### 4.1. UI Injection (`Wrapper.loader.tsx`)

#### Using Portals

Use the `<Portal />` component to render your UI into specific DOM elements.

> [!TIP]
> Always create a dedicated container for your portal to avoid conflicts and ensure proper cleanup.

```tsx
import { lazily } from "react-lazily";
import { Portal } from "@/components/ui/portal";
import CsUiGuard from "@/entrypoints/contexts/content-scripts/services/ui-guard/CsUiGuard";
import { csUiMount } from "@/entrypoints/contexts/content-scripts/ui-groups/_root/CsUiRoot";

// Lazy load your component
const { MyFeatureComponent } = lazily(
  () => import("./MyFeatureComponent"),
);

function useMyFeatureContainer() {
  // 1. Find the anchor element
  const $anchor = $(".some-perplexity-element");
  if (!$anchor.length) return null;

  // 2. Check for existing container to prevent duplication
  const existingContainer = document.getElementById("my-feature-container");
  if (existingContainer) return existingContainer;

  // 3. Create and inject your container
  const $container = $("<div>").attr("id", "my-feature-container");

  // Position relative to anchor (append, prepend, before, after)
  $anchor.append($container);

  return $container[0];
}

function MyFeatureWrapper() {
  const container = useMyFeatureContainer();

  return (
    <CsUiGuard requiresLoggedIn dependentPluginIds={["myFeature"]}>
      <Portal container={container}>
        <MyFeatureComponent />
      </Portal>
    </CsUiGuard>
  );
}

export default function () {
  csUiMount({
    id: "plugin:myFeature",
    component: <MyFeatureWrapper />,
  });
}
```

#### Existing UI Groups

For common locations, check `src/entrypoints/contexts/content-scripts/ui-groups/`. You can mount directly to these groups if they fit your needs:

- **Routes**: `Home`, `Thread`, `Settings`
- **Elements**: `query-box`

### 5. Settings UI (`settings-ui.opt-loader.tsx`)

```tsx
import { registerSettingsUi } from "@/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/plugin-settings-uis/registry";
import { useSettings } from "./settings";
import { Switch } from "@/components/ui/switch";

function MyFeatureSettingsUi() {
  const { settings, update } = useSettings();

  return (
    <Switch
      textLabel="Enable"
      checked={settings.enabled}
      onCheckedChange={({ checked }) => {
        void update({
          updateFn: (draft) => {
            draft.enabled = checked;
          },
        });
      }}
    />
  );
}

export default function () {
  registerSettingsUi({
    pluginId: "myFeature",
    ui: <MyFeatureSettingsUi />,
  });
}
```

## Testing & Debugging

### Development Tools

_To be documented..._

### HMR Support

See [HMR](./hmr.md).

### E2E Testing

_To be documented..._

## Publishing Considerations

### Feature Flags

_To be documented..._

### Versioning

_To be documented..._

## Related Docs

- [Architecture](./architecture.md) - System structure and boundaries
- [HMR](./hmr.md) - Hot Module Replacement troubleshooting
- [DX](./dx.md) - Development environment setup
