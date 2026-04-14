# Refactor: `hotkeys-js` → TanStack Hotkeys

## Scope

Changed files:

- `package.json`
- `pnpm-lock.yaml`
- `src/utils/wrappers/hotkeys-js/index.ts`
- `src/components/ui/sidebar.tsx`
- `src/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/SearchInput.tsx`
- `src/plugins/command-menu/CommandMenu.tsx`
- `src/plugins/command-menu/pages/spaces/SpaceCommandItems.tsx`
- `src/plugins/prompt-history/slash-command/CommandMenuContent.tsx`
- `src/plugins/command-menu/items/searches/index.loader.ts`
- `src/plugins/prompt-history/slash-command/trigger.loader.ts`
- `src/plugins/zen-mode/loader.ts`

---

## Dependency changes

### Added

- `@tanstack/hotkeys@0.3.0`
- `@tanstack/react-hotkeys@^0.3.0`

### Removed

- `hotkeys-js@4.0.0`

Lockfile now includes TanStack hotkeys/store/react-store entries and removes `hotkeys-js` snapshots.

---

## Architecture change

### Before

- Imperative `hotkeys-js` bindings via wrapper import `@/utils/wrappers/hotkeys-js`
- React components mostly used `useEffect` + bind/unbind manually

### After

Two paths:

1. **React components** use `useHotkey` from `@tanstack/react-hotkeys`
2. **Non-React loaders** keep imperative `hotkeys(...)` API through the local wrapper (now backed by `@tanstack/hotkeys`)

This keeps old call sites stable where hooks are not usable, while modernizing React registration.

---

## Wrapper rewrite (`src/utils/wrappers/hotkeys-js/index.ts`)

The wrapper is now a compatibility adapter over TanStack APIs.

### New imports

- `getHotkeyManager`
- `getKeyStateTracker`
- `normalizeHotkey`
- `normalizeKeyName`
- `parseHotkey`
- `ParsedHotkey`
- `HotkeyRegistrationHandle`

### Exposed surface

- Callable default export: `hotkeys(combo, handler)`
- `hotkeys.unbind(combo, handler?)`
- `hotkeys.isPressed(key)`
- `hotkeys.filter(event)`
- `parseHotkeyCombo(combo)` (new export, used by React hook callers)

### Internal behavior

- Registrations tracked in nested maps:
  - `Map<normalizedCombo, Map<handler, Set<registrationHandle>>>`
- `unbind` supports:
  - specific handler unbind
  - full combo unbind (all handlers)
- `isPressed` now delegates to TanStack `KeyStateTracker` after normalization

### Key normalization logic

`normalizePressedKey` maps legacy aliases:

- `ctrl` → `Control`
- `cmd` / `command` → `Meta`
- `option` → `Alt`
- `esc` → `Escape`
- single letters are uppercased (`a` → `A`)
- fallback: `normalizeKeyName`

### Other utility change

`isFormTag` now handles `null` targets safely.

---

## React migrations

## 1) Sidebar

File: `src/components/ui/sidebar.tsx`

- Replaced `useEffectEvent + useEffect + hotkeys/unbind` with `useHotkey`
- Hotkey: `Meta/Ctrl + b` (from existing `keysToString(...)` path)
- Callback still:
  - `preventDefault()`
  - dispatches `resize`
  - toggles sidebar

## 2) Options Page Plugin Search Input

File: `src/entrypoints/contexts/options-page/routes/dashboard/pages/plugins/components/SearchInput.tsx`

- Added module-level parsed combo constant:
  - `SEARCH_HOTKEY = parseHotkeyCombo(Meta/Ctrl + e)`
- Replaced manual bind/unbind with `useHotkey`
- Behavior unchanged: focus `#search-plugins`

## 3) Command Menu

File: `src/plugins/command-menu/CommandMenu.tsx`

- Toggle menu hotkey now via `useHotkey`
- Toggle sidecar hotkey now via `useHotkey` with `{ enabled: open }`
- Existing behavior preserved:
  - stop immediate propagation
  - prevent default
  - flip open/sidecar states

## 4) Space Command Items

File: `src/plugins/command-menu/pages/spaces/SpaceCommandItems.tsx`

- Replaced manual Ctrl+C binding with `useHotkey`
- Enabled only when command menu is open
- Behavior unchanged: copy selected space ID + success toast

## 5) Prompt History Slash Command Menu

File: `src/plugins/prompt-history/slash-command/CommandMenuContent.tsx`

- Copy hotkey moved to `useHotkey` (`Meta/Ctrl + c`)
- Delete hotkey moved to `useHotkey` (`Delete`)
- Added parsed constant:
  - `PROMPT_HISTORY_DELETE_HOTKEY = parseHotkeyCombo(Key.Delete)`

---

## Imperative loader updates (cleanup and rebinding safety)

These files still use wrapper `hotkeys(...)` (non-React context), but now handle re-runs safely.

## 1) Search item keybindings loader

File: `src/plugins/command-menu/items/searches/index.loader.ts`

- Added module-level disposer: `disposeSearchItemKeybindings`
- On loader run:
  - dispose old bindings first
  - skip empty keybindings (`length === 0`)
  - capture per-item unbind function
- Rebuilds disposer from collected unbinders

## 2) Prompt history trigger loader

File: `src/plugins/prompt-history/slash-command/trigger.loader.ts`

- Added module-level disposer: `disposePromptHistoryShortcut`
- On loader run:
  - dispose old shortcut before rebinding
  - skip empty shortcut keybinding
  - register combo+handler pair and keep exact unbind closure

## 3) Zen mode loader

File: `src/plugins/zen-mode/loader.ts`

- Added module-level disposer: `disposeZenModeHotkey`
- Loader clears previous binding before setup
- `setupKeybinding(...)` now:
  - disposes previous binding
  - skips empty hotkey arrays
  - stores exact combo/handler for unbind

---

## Practical behavior delta

What actually changed at runtime:

- React-side hotkeys no longer depend on manual `useEffect` bind/unbind boilerplate.
- Loader-side hotkeys are less leak-prone on repeated loader execution.
- Combo parsing/normalization now goes through TanStack (`normalizeHotkey` / `parseHotkey`) rather than `hotkeys-js` parser.
- Key pressed tracking (`isPressed`) now uses TanStack key state tracker.

What intentionally did **not** change:

- Existing callsite import path `@/utils/wrappers/hotkeys-js` in non-React code.
- Existing command behavior (toggle/copy/delete/focus semantics).

---

## Notes / watch-outs

- The wrapper now normalizes combos and parses with TanStack; invalid combo strings can fail differently than before.
- React call sites pass options with `preventDefault: false` and still call `event.preventDefault()` manually in handlers.
- Several loaders/components now explicitly skip empty keybinding arrays, preventing accidental registration.

---

## Net result

- Legacy hotkeys dependency removed.
- TanStack hotkeys stack adopted.
- React code simplified with hook-based registration.
- Imperative loader bindings now have explicit disposal lifecycle.
- Existing behavior preserved while reducing rebinding/leak edge cases.

---

Generated with [Claude Code](https://claude.com/claude-code)