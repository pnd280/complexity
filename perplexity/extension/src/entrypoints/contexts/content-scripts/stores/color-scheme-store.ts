import { subscribeWithSelector } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { mutative } from "zustand-mutative";

import { setCookie } from "@/utils/dom-utils/generics";
import { whereAmI } from "@/utils/misc/utils";

export type ColorScheme = "light" | "dark" | "system";

type ColorSchemeStoreType = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
};

export const colorSchemeStore = createWithEqualityFn<ColorSchemeStoreType>()(
  subscribeWithSelector(
    mutative(
      (): ColorSchemeStoreType => ({
        colorScheme: "system",
        setColorScheme: (scheme) => {
          const systemPreference = window.matchMedia(
            "(prefers-color-scheme: dark)",
          ).matches
            ? "dark"
            : "light";

          if (scheme === "system") {
            $("html").attr("data-color-scheme", systemPreference);
          } else {
            $("html").attr("data-color-scheme", scheme);
          }

          if (whereAmI() !== "unknown") {
            setCookie(
              "colorScheme",
              scheme === "system" ? systemPreference : scheme,
              365,
            );
          }
        },
      }),
    ),
  ),
);

export const useColorSchemeStore = colorSchemeStore;
