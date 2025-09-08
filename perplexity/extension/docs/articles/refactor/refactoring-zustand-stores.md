# Refactoring Zustand Stores: A Guide

This guide provides a step-by-step process for refactoring a large, monolithic Zustand store into a more organized, scalable, and maintainable structure using the "slice" pattern observed in this codebase.

## Why Refactor?

A single, large Zustand store can quickly become difficult to manage. Logic gets tangled, finding specific state or actions becomes a chore, and the risk of introducing bugs increases.

The slice pattern, as used by the `slash-command` plugin, addresses this by breaking the store into smaller, domain-focused pieces.

**Benefits:**

- **Improved Readability**: Code is organized by feature, making it easier to understand.
- **Enhanced Maintainability**: Changes are isolated to specific slices, reducing side effects.
- **Better Scalability**: Adding new features is as simple as adding a new slice.
- **Clear Separation of Concerns**: State logic is decoupled from side-effect logic (subscriptions).

## The Goal: From Monolith to Slices

Our goal is to transform a store that looks like this:

**Before: `store.ts` (The Monolith)**

```typescript
// src/features/some-feature/store.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface StoreState {
  // User state
  user: User | null;
  setUser: (user: User) => void;

  // Settings state
  theme: "dark" | "light";
  toggleTheme: () => void;

  // Modal state
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useFeatureStore = create<StoreState>()(
  immer((set) => ({
    // User implementation
    user: null,
    setUser: (user) => set({ user }),

    // Settings implementation
    theme: "light",
    toggleTheme: () =>
      set((state) => {
        state.theme = state.theme === "light" ? "dark" : "light";
      }),

    // Modal implementation
    isModalOpen: false,
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
  })),
);
```

...into a structured, slice-based store.

**After: The Slice-based Structure**

```
src/plugins/some-feature/store/
├── slices/
│   ├── modal/
│   │   ├── index.ts
│   │   └── types.ts
│   ├── settings/
│   │   ├── index.ts
│   │   ├── subs.ts
│   │   └── types.ts
│   └── user/
│       ├── index.ts
│       └── types.ts
├── index.ts
└── types.ts
```

## Step-by-Step Refactoring Guide

### 1. Plan Your Slices

First, identify the logical domains within your existing store. In our example monolith, we can see three clear domains: `user`, `settings`, and `modal`. Each of these will become a slice.

### 2. Create the Directory Structure

Create the new directory structure for your store.

```
src/plugins/some-feature/store/
├── slices/
│   ├── modal/
│   │   ├── index.ts
│   │   └── types.ts
│   ├── settings/
│   │   ├── index.ts
│   │   ├── subs.ts
│   │   └── types.ts
│   └── user/
│       ├── index.ts
│       └── types.ts
```

### 3. Create the Main Store Files

In the root of your new store directory (`src/plugins/some-feature/store/`), create the main `index.ts` and `types.ts`.

**`types.ts`**
This file will merge the types from all the individual slices.

```typescript
// src/plugins/some-feature/store/types.ts
import type { ModalSlice } from "./slices/modal/types";
import type { SettingsSlice } from "./slices/settings/types";
import type { UserSlice } from "./slices/user/types";

export type FeatureStoreType = UserSlice & SettingsSlice & ModalSlice;
```

**`index.ts`**
This file is responsible for assembling the slices into a single store.

```typescript
// src/plugins/some-feature/store/index.ts
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { createModalSlice } from "./slices/modal";
import { createSettingsSlice, settingsSubscriptions } from "./slices/settings";
import { createUserSlice } from "./slices/user";
import type { FeatureStoreType } from "./types";

export const featureStore = createWithEqualityFn<FeatureStoreType>()(
  subscribeWithSelector(
    immer((set, get, ...props) => ({
      ...createUserSlice(set, get, ...props),
      ...createSettingsSlice(set, get, ...props),
      ...createModalSlice(set, get, ...props),
    })),
  ),
);

// Initialize any centralized subscriptions
(() => {
  settingsSubscriptions(featureStore);
})();

export const useFeatureStore = featureStore;
```

### 4. Create Each Slice

Now, move the logic from the old store into its corresponding slice.

#### User Slice

**`slices/user/types.ts`**

```typescript
export interface UserSlice {
  user: User | null;
  setUser: (user: User) => void;
}
```

**`slices/user/index.ts`**

```typescript
import type { StateCreator } from "zustand";
import type { FeatureStoreType } from "../../types";
import type { UserSlice } from "./types";

export const createUserSlice: StateCreator<
  FeatureStoreType,
  [],
  [],
  UserSlice
> = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
});
```

#### Settings Slice (with a subscription)

**`slices/settings/types.ts`**

```typescript
export interface SettingsSlice {
  theme: "dark" | "light";
  toggleTheme: () => void;
}
```

**`slices/settings/index.ts`**

```typescript
import type { StateCreator } from "zustand";
import type { FeatureStoreType } from "../../types";
import type { SettingsSlice } from "./types";

export const createSettingsSlice: StateCreator<
  FeatureStoreType,
  [],
  [],
  SettingsSlice
> = (set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    }),
});

// Re-export subscriptions for easy import in the main index
export { settingsSubscriptions } from "./subs";
```

**`slices/settings/subs.ts`**
This file handles side effects. For example, let's say we want to persist the theme to `localStorage`.

```typescript
import type { FeatureStoreType } from "../../types";

export const settingsSubscriptions = (store: FeatureStoreType) => {
  store.subscribe(
    (state) => state.theme,
    (theme) => {
      // Side effect: sync theme to localStorage
      console.log("Theme changed to:", theme);
      localStorage.setItem("theme", theme);
    },
  );
};
```

### 5. Update Your Components

Finally, update the components that use the store. The great part is that the hook `useFeatureStore`
