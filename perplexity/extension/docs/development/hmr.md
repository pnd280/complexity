# Hot Module Replacement (HMR)

## TL;DR

- Use `vite@7`, otherwise see [issue](https://github.com/crxjs/chrome-extension-tools/issues/971) + [workaround](https://github.com/crxjs/chrome-extension-tools/issues/971#issuecomment-2605520184), explicitly declare the port in `vite.config.ts`
- **No inline imports** in background/service workers (completely breaks HMR)
- **Limited scope**: React components + directly imported CSS only; others need reload

## Configuration

### 1. Explicit Server Port

**ONLY** applies to `vite` < 7. In `vite.config.ts`, always specify the port:

```typescript
export default defineConfig({
  server: {
    port: 5173, // Explicit port required
    strictPort: true,
  },
  // ... rest of config
});
```

### 2. Background Script Import Cautions

**❌ Don't do this:**

```typescript
// background.ts
import styles from "./some-css-file.css?inline"; // Breaks HMR
```

**✅ Do this instead:**

```typescript
// background.ts
import styles from "./some-css-file.css"; // Standard import
```

_but why would you even need to import CSS files in background scripts in the first place? 🤷 rethink the design._

## Known Limitations

### What Hot Reloads

- ✅ **React components** in content scripts and extension UIs
- ✅ **Directly imported CSS modules**

### What Requires Full Page/Extension Reload

- ❌ **Inline-imported assets** (`?inline` suffix)
- ❌ **Constants and utility functions**
- ❌ **Auto-discovered modules**
- ❌ **Background script**

### What Requires a Manual Re-save

- ❌ **Plugin registration changes**
- ❌ **Auto-discovered modules changes**

> [!IMPORTANT]
> When you add or remove plugin registrations or auto-discovered modules, you'll need to manually re-save to the register files (the files in which calling `import.meta.glob` to the affected modules). Otherwise, Vite won't pick up the changes.

## Related Docs

- [DX](./dx.md) - Development setup and workflows
- [Tech Stack](./tech-stack.md) - Vite configuration details
- [Build Your Own Plugin](./build-your-own-plugin.md) - Plugin development with HMR
