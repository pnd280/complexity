# Build Your Own Plugin

## Who This Is For

Anyone adding or iterating on feature plugins for the Complexity Perplexity Extension.

> [!IMPORTANT]
> PR for new plugins/features are NOT accepted. If you'd like to add a new feature, please open an issue first.

## Prerequisites

- Read [Architecture](./architecture.md) for contexts and boundaries understanding
- Development environment ready (see [DX](./dx.md))

## Plugin Anatomy

### Directory Structure

Each plugin follows a feature-based structure in its own directory:

```
src/plugins/your-plugin-name/
├── components/            # UI components
├── hooks/                 # React hooks
├── index.manifest.ts[*]   # Entry point and registration
├── store.ts               # State management (Zustand)
├── utils.ts               # Utility functions
├── types.ts               # Type definitions
├── settings-ui.tsx[*]     # Optional settings interface
├── **/(*.)loader.ts[*]    # Run arbitrary code (still needs guard if the plugin is disabled)
└── **/*.public.ts[*]      # Public exports
```

> [!IMPORTANT]
> `[*]` Exact naming required.

### Discovery & Registration

Plugins are **automatically discovered** via Vite's `import.meta.glob`:

1. **Create directory** under `src/plugins/your-plugin-name/`
2. **Add `index.manifest.ts`** with plugin registration
3. **No manual registration** required - system auto-detects valid patterns and integrates

## Execution Contexts & Entrypoints

### Where Your Code Runs

- **Background**: Plugins functionality should not be running directly in the background. Implement a core plugin instead.
- **Content Scripts**: DOM manipulation, UI injection/modification
- **Main-world**: Access to page's React fiber tree or other page-specific APIs that can not be accessed from content scripts
- **Extension UI**: Settings panels

### Typical Plugin Flow

1. **Register** plugin in `index.ts`
2. **Observe** page events (routing, DOM changes)
3. **Inject** UI components into Perplexity pages (prioritize React, use the existing design system)
4. **Store** local state using Zustand, Extension Storage or IndexedDb for persistent storage

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

### 1. Directory Structure

_To be documented..._

### 2. Plugin Registration

_To be documented..._

### 3. Enable in Settings

_To be documented..._

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
