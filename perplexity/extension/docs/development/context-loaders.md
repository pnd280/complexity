## Context Loaders:

> Convention: `*.<suffix>.{ts,tsx}`

### `lib-loader`

- Run in the same context as `loader` but for guaranteed to run before them

### `loader`

- Run arbitary code in the content script on load

### `opt-loader`

- Run arbitary code in the Options Page entrypoint, often used for settings UI mount

### `bg-worker`

- Run arbitary code in the background script
