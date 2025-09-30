# Architecture

## At a Glance

A browser extension that provides client-side modifications to the Perplexity AI interface. Strives for clean code organization.

## Execution Contexts

The extension operates across **four execution contexts**:

- **Extension UI** - Options page (Settings Dashboard)
- **Background** - Long-running tasks, persists when UI is closed
- **Content Scripts** - Injected into Perplexity pages for functionality enhancement
- **Main-world Content Scripts** - Runs in page's document context (intercepts network requests, router, React fiber tree)

## Directory Structure

```
src/
├── assets/         # Static assets
├── components/     # Shared UI components
├── data/           # Shared data sources and constants
├── entrypoints/    # Entry points for different contexts
├── hooks/          # Shared React hooks
├── plugins/        # Modular feature implementations
│   ├── _core/      # Core plugin functionality
│   └── */          # Individual feature plugins
├── services/       # Shared services
├── types/          # TypeScript type definitions
└── utils/          # Shared utility functions
```

## Plugin System (Overview)

Modular architecture for independent feature implementation:

- **Modular**: Each plugin in its own `src/plugins/` directory
- **Discoverable**: Auto-registered via Vite's `import.meta.glob`
- **Configurable**: Enable/disable with automatic side-effect cleanup
- **Dependency-aware**: Dependent plugins auto-disabled when dependencies are disabled

### Central Registries

- [Plugin Registry](../src/data/plugin-registry/index.ts) - Core plugin definitions
- [Plugin Loaders Registry](../src/entrypoints/content-scripts/loaders.ts) - Run arbitrary code when plugin is loaded
- [Settings UI Loader](../src/entrypoints/options-page/dashboard/pages/plugins/components/plugin-settings-uis/loader.ts) - Configuration interfaces

### Module Discovery

Automatic discovery and registration via **Vite's `import.meta.glob`** for:

- Plugin implementations and async dependencies
- Background services
- Settings UI components
- Internationalization modules

> **See [Build Your Own Plugin](./build-your-own-plugin.md) for detailed structure, APIs, and examples.**

## Dependency Boundaries

- [Dependency boundaries](../eslint-config/boundaries/index.js).
- [File naming convention](./file-suffixes.md).

### Import Rules

Dependency flow is strictly controlled where each boundary type can only import from allowed types. Higher layers can import from lower layers, but not vice versa.

```mermaid
flowchart TD
    S["Shared<br/><small>Common utilities, components, hooks</small>"]
    PC["Core Plugin<br/><small>Core plugin functionality & APIs</small>"]
    P["Plugin<br/><small>Individual feature implementations</small>"]
    E["Entrypoint<br/><small>Entry points for different contexts</small>"]

    E -->|"can import"| P
    E -->|"can import"| PC
    E -->|"can import"| S
    P -->|"can import"| PC
    P -->|"can import"| S
    PC -->|"can import"| S

    classDef entrypoint fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef plugin fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef pluginCore fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef shared fill:#e8f5e8,stroke:#388e3c,stroke-width:2px

    class E entrypoint
    class P plugin
    class PC pluginCore
    class S shared
```

## Data & Persistence

- **Extension Storage**: Configuration and lightweight data
- **IndexedDB**: Complex data structures and caching

## Related Docs

- [Build Your Own Plugin](./build-your-own-plugin.md) - Plugin development guide
- [Tech Stack](./tech-stack.md) - Technologies and tools overview
- [DX](./dx.md) - Development setup and workflows
