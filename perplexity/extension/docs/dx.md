# DX

## Environment Setup

### Requirements

- Node.js ^22
- PNPM package manager
- Any Chromium-based browser (Chrome, Edge, Brave, etc.)
  - **Firefox is NOT supported for running the dev environment**

## Development Workflow

### Getting Started

1. Clone the repository

2. Install dependencies:

   ```bash
   pnpm i -g turbo
   git submodule update --init --recursive
   pnpm install
   pnpm turbo build --filter=./packages/*
   ```

   If you're planning to build for Firefox:
   - Navigate to the git module `packages/webext-bridge`
   - Checkout this [PR](https://github.com/serversideup/webext-bridge/pull/94)
   - Run `turbo build` again

3. Use the official remote configs registry (optional):
   Add the following to the `.env` file in the folder `perplexity/extension`:

   ```.env
   VITE_CPLX_CDN_URL=https://cdn.cplx.app
   ```

4. Start the development server:

   ```bash
   cd perplexity/extension
   pnpm turbo dev
   ```

   - At the current size of the project, dev server might take up to 30 seconds to finish transpiling the necessary code for the extension to work **initially**.
   - HMR not working? Refer to [HMR Support](./hmr.md).

5. Enable "Developer mode" on `chrome://extensions`
6. Load the extension from the `perplexity/extension/dist/chrome` folder

### Build Process

```bash
# Build for Chrome
pnpm turbo build

# Build for Firefox
pnpm turbo build:firefox

# Build for both browsers and create .zip distribution packages
pnpm turbo zip:all
```

## Developer Tools

> [!TIP]
> For the best experience on VSCode, it is strongly recommended to open the `/perplexity/extension` as a dedicated workspace.

### Linting and Formatting

- Prettier TailwindCSS class sorting
- In addition to common TypeScript/React ESLint rules, this project includes some specific rules:
  - Enforces strict null checks ([`@typescript-eslint/strict-boolean-expressions`](https://typescript-eslint.io/rules/strict-boolean-expressions/))
  - Enforces specific filename casing (`PascalCase`, `kebab-case`, `camelCase`)
  - Provides automatic global imports via `unimport` (see [config](../src/types/unimport.config.ts))
  - Enforces import scoping via [`eslint-plugin-boundaries`](https://github.com/javierbrea/eslint-plugin-boundaries) to maintain a clean architecture with clear dependency directions (see [config](../eslint-config/boundaries.js))

### Development Commands

- `pnpm lint`: Run ESLint
- `pnpm lintq`: Run ESLint but only show errors
- `pnpm lintf`: Run ESLint with auto-fix
- `pnpm fmt`: Format all code with Prettier
- `pnpm clean`: Delete `node_modules` and `dist` directories
- Unit tests with Vitest
  - `pnpm test`: Run tests
  - `pnpm test:ui`: Run tests with UI
- End-to-end tests with Playwright
  - Currently only boilerplate code, working unreliable due to Cloudflare protection

## Editor Experience

### VSCode Integration `.vscode/settings.json`

- File exclusions to keep the explorer clean
- You might want to adjust `typescript.tsserver.maxTsServerMemory` to match your system's specs
- TailwindCSS (v4) IntelliSense support for jQuery's methods

## Misc

- You will see that the project uses `lazily` from `react-lazily` to lazy load React components. So why not `React.lazy`?
  - `react-lazily` supports named exports with shorter syntax
  - `React.lazy` doesn't play well with VSCode's Typescript references, which means it always show `0 references` for the lazy loaded components
  - See https://github.com/microsoft/TypeScript/issues/50957#issuecomment-2562425998
