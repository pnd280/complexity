## Project-specific guidance

### Auto-imports

This project uses automatic imports configured in `src\auto-imports-config.ts`. Do not add manual imports for symbols covered by the auto-import config:

- React preset symbols: `useState`, `useCallback`, `useMemo`, `useEffect`, `useRef`, `useContext`, `useReducer`
- React symbols: `createContext`, `lazy`, `memo`, `use`, `useDeferredValue`, `useEffectEvent`
- i18n symbols: `Trans`, `TransWithPrefix`, `extendT`, `t`
- App symbols: `Key`, `invariant`, `isMainWorldContext`, `sleep`, `cn`, `tw`, `deepEqual`, `tryCatch`
- Default aliases: `$` from `jquery`, `ms` from `ms`
