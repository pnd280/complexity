# Hot Module Replacement (HMR)

## TL;DR

- Use `vite@7`, otherwise see [issue](https://github.com/crxjs/chrome-extension-tools/issues/971) + [workaround](https://github.com/crxjs/chrome-extension-tools/issues/971#issuecomment-2605520184) + [explicit port declaration](#2-explicit-server-port)
- **No inline imports** in background/service workers (completely breaks HMR)
- **Limited scope**: React components + directly imported CSS only; others need reload

## Configuration

### 1. Explicit Server Port

Only applies to `vite` < 7. In `vite.config.ts`, always specify the port:

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

### What Requires Full Reload

- ❌ **Inline-imported assets** (`?inline` suffix)
- ❌ **Constants and utility functions**
- ❌ **Plugin manifest changes**
- ❌ **Background script modifications**

### What Requires a Manual Re-save

- ❌ **Plugin registration changes**
- ❌ **Auto-discovered module changes**

> [!IMPORTANT]
> When you add or remove plugin registrations or auto-discovered modules, you'll need to manually re-save to the register files (the files in which calling `import.meta.glob` to the affected modules). Otherwise, Vite won't pick up the changes and you'll have to restart the dev server.

## Troubleshooting

### HMR Not Firing?

1. **Check Vite version** - Must be ≤ 5.4.11
2. **Verify port config** - Explicit port in `vite.config.ts`
3. **Review imports** - No inline imports in background scripts
4. **Check file types** - Only React components and CSS hot reload

### Changes Not Reflecting?

- **Constants/utils changed?** → Full page reload required
- **Plugin registration modified?** → Restart dev server
- **Background script updated?** → Reload extension

### Port Conflicts

If port 5173 is in use:

1. Change port in `vite.config.ts`
2. Update any hardcoded references
3. Restart dev server

## FAQ

**Q: Why the Vite version restriction?**
A: CRXJS plugin compatibility issue with newer Vite versions.

**Q: Can I use dynamic imports?**
A: Yes, but avoid `?inline` suffix in background scripts.

**Q: HMR works for extension UI but not content scripts?**
A: Check that content script components are properly registered and imported.

## Related Docs

- [DX](./dx.md) - Development setup and workflows
- [Tech Stack](./tech-stack.md) - Vite configuration details
- [Build Your Own Plugin](./build-your-own-plugin.md) - Plugin development with HMR
