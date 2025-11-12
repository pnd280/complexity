import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

import {
  defaultNavItems,
  type NavItem,
} from "@/entrypoints/options-page/components/sidebar/nav-items";

type OptionsPageSidebarStoreType = {
  navItems: NavItem[];
};

export const optionsPageSidebarStore =
  createWithEqualityFn<OptionsPageSidebarStoreType>()(
    subscribeWithSelector(mutative(() => ({ navItems: defaultNavItems }))),
  );

export const useOptionsPageSidebarStore = optionsPageSidebarStore;
