# TypeScript Rules

## Type over Interface (with Exceptions)

**PREFER using `type` over `interface` for type definitions.**

Use `interface` only when:

- Module augmentation is needed (extending global types, plugin registries)
- Extending across multiple files (registry patterns)
- Class implementation contracts

```ts
// Correct - simple objects
type User = {
  id: string;
  name: string;
};

// Correct - module augmentation
declare global {
  interface Window {
    customApi: CustomAPI;
  }
}

// Correct - plugin registry extension
interface PluginsRegistry {
  myPlugin: MyPluginConfig;
}

// Avoid for simple definitions
interface User {
  id: string;
  name: string;
}
```

Why types are preferred: More flexible, composable, consistent with project style.

## Object Parameters over Multiple Parameters

**PREFER function object parameter over multiple parameters.**

```ts
// Correct
function createUser(params: { name: string; email: string; role: string }) {
  // ...
}

// Avoid
function createUser(name: string, email: string, role: string) {
  // ...
}
```

Why: Better readability, easier to extend, clearer intent at call site.

## No Runtime-Specific Features

**DO NOT use TypeScript-specific runtime features (non-erasable syntax).**

Avoid:

- `enum` declarations
- `namespace` declarations
- `const enum` (compile-time constants)
- Decorators (unless in frameworks like Angular/NestJS)

```ts
// Avoid
enum Status {
  Active = "active",
  Inactive = "inactive",
}

// Correct - use types with const assertions
type Status = "active" | "inactive";
const Status = { Active: "active", Inactive: "inactive" } as const;
```

## Review Checklist

When reviewing or modifying TypeScript code:

1. **Simple object definitions** → suggest `type` instead of `interface`
2. **Multiple params** → consolidate into object param with named type
3. **Search `enum`** → suggest union type + const object pattern
4. **Search `namespace`** → suggest object export pattern
5. **For interfaces** → verify they're used for:
   - Module augmentation (declare global, plugin registries)
   - Multi-file registry extensions
   - Class implementation contracts
