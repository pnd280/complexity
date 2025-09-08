# Developer Experience (DX)

## Who this is for

Contributors and developers working on the Complexity Perplexity Extension.

## Requirements

- Node.js ^22
- PNPM package manager
- Any Chromium-based browser (Chrome, Edge, Brave, etc.)
  - **Firefox is NOT supported for running the dev environment**

## Quickstart

1. **Clone the repository**

2. **Install dependencies:**

   ```bash
   pnpm i -g turbo
   git submodule update --init --recursive
   pnpm install
   pnpm turbo build --filter=./packages/*
   ```

3. **Optional: Use official remote configs registry**

   Add to `.env` file in `perplexity/extension`:

   ```env
   VITE_CPLX_CDN_URL=https://cdn.cplx.app
   ```

4. **Start the development server:**

   ```bash
   cd perplexity/extension
   pnpm turbo dev
   ```

5. **Load the extension:**
   - Enable "Developer mode" on `chrome://extensions`
   - Load unpacked extension from `perplexity/extension/dist/chrome` folder

> **Note:** Initial transpilation may take up to 30 seconds. HMR issues? See [HMR Support](./hmr.md).

## Common Tasks

### Linting and Formatting

- `pnpm lint`: Run ESLint
- `pnpm lintq`: Run ESLint (errors only)
- `pnpm lintf`: Run ESLint with auto-fix
- `pnpm fmt`: Format all code with Prettier
- `pnpm clean`: Delete `node_modules` and `dist` directories

### Testing

- **Unit tests (Vitest):**
  - `pnpm test`: Run tests
  - `pnpm test:ui`: Run tests with UI

- **E2E tests (Playwright):**
  - Currently boilerplate only; unreliable due to Cloudflare protection

## Build & Distribution

```bash
# Build for Chrome
pnpm turbo build

# Build for Firefox
pnpm turbo build:firefox

# Build for both browsers and create .zip distribution packages
pnpm turbo zip:all
```

## Editor Setup (VSCode)

> [!TIP]
> For the best experience, open `/perplexity/extension` as a dedicated workspace.

### Configuration Features

- File exclusions to keep explorer clean
- TailwindCSS (v4) IntelliSense support for jQuery methods
- Adjust `typescript.tsserver.maxTsServerMemory` to match your system specs

### ESLint Rules

In addition to common TypeScript/React rules, this project includes:

- Strict null checks ([`@typescript-eslint/strict-boolean-expressions`](https://typescript-eslint.io/rules/strict-boolean-expressions/))
- Filename casing enforcement (`PascalCase`, `kebab-case`, `camelCase`)
- Automatic global imports via `unimport` ([config](../src/types/unimport.config.ts))
- Import scoping via [`eslint-plugin-boundaries`](https://github.com/javierbrea/eslint-plugin-boundaries) ([config](../eslint-config/boundaries.js))

## Troubleshooting

### Development Server

- **Initial build time:** Up to 30 seconds for first transpilation
- **HMR not working?** See [HMR Support](./hmr.md)

### Code Quality

- **Prettier:** Includes TailwindCSS class sorting
- **React components:** Uses `react-lazily` instead of `React.lazy` for better VSCode TypeScript references ([issue](https://github.com/microsoft/TypeScript/issues/50957#issuecomment-2562425998))

## Related Docs

- [Tech Stack](./tech-stack.md) - Technologies and tools overview
- [HMR](./hmr.md) - Hot Module Replacement troubleshooting
- [Architecture](./architecture.md) - System structure and boundaries
