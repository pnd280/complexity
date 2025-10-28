# Tech Stack

## Scope

This covers the technologies you'll encounter as a contributor. For deep architecture details, see [Architecture](./architecture.md).

## Core Technologies

### Build & Development

- **Vite**: Build tool with fast HMR (see [HMR caveats](./hmr.md))
- **CRXJS Vite Plugin**: The only reliable Vite plugin supporting HMR for Content Script UIs

### UI & Styling

- **[Ark UI](https://github.com/chakra-ui/ark)**: Headless UI library (migrated from Radix due to floating component performance issues)
- **jQuery**: DOM manipulation with better syntaxes
- **TailwindCSS 4**: Styling for both Extension and Content Script UIs (prefix: `x:`)

### State Management

- **Zustand**: Client state management
- **TanStack Query**: Async state management
- **[`comctx`](https://github.com/molvqingtai/comctx)**: RPC communication between execution contexts

### Internationalization

- **[Custom typesafe implementation](../../../packages/i18n/README.md)**

## Development Tools

- **ESLint**: Linting with strict boundaries enforcement
- **Prettier**: Code formatting with TailwindCSS class sorting
- **Vitest**: Unit testing
- **Playwright**: End-to-end testing

## Browser Support Notes

### Development Environment

- **Supported**: Chromium-based browsers (Chrome, Edge, Brave)
- **Not supported**: Firefox for development (see [DX](./dx.md))

## Related Docs

- [DX](./dx.md) - Development setup and workflows
- [HMR](./hmr.md) - Hot Module Replacement troubleshooting
- [Architecture](./architecture.md) - System design and structure
