# Tech Stack

## Core Technologies

- **Vite**: Build tool
- **CRXJS Vite Plugin**: The only reliable Vite plugin that supports [HMR](./hmr.md) for Content Script UIs
- [Ark UI](https://github.com/chakra-ui/ark): Headless UI library for most components (previously used Radix Primitives, but the performance of floating components was a significant issue)
- **jQuery**: For better DOM manipulation syntaxes
- **TailwindCSS 4**: for both Extension and Content Script UIs (Prefix `x:`)
- **Zustand**: State management
- **TanStack Query**: Async state management
- **[`comctx`](https://github.com/molvqingtai/comctx)**: RPC communication between execution contexts.

- **I18Next**: Localization (22 languages, including English)

## Development Tools

- **ESLint**: Linting
- **Prettier**: Formatter
- **Vitest**: Unit testing
- **Playwright**: End-to-end testing
- **Gulp**: Task automation

Refer to [DX](./dx.md) for more details
