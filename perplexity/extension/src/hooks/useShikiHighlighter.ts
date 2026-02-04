import { useSyncExternalStore } from "react";

import {
  ensureLanguage,
  getSnapshot,
  resolveLanguage,
  subscribe,
} from "@/services/shiki/highlighter";

export function useShikiHighlighter(language: string) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const normalizedLang = language.toLowerCase();

  ensureLanguage(language);

  const resolvedLanguage = resolveLanguage(language);

  // Ready if: the resolved language is loaded, OR it's plaintext (always available)
  const isReady =
    resolvedLanguage === "text" ||
    state.loadedLanguages.has(normalizedLang) ||
    state.loadedLanguages.has(resolvedLanguage);

  return {
    highlighter: state.highlighter,
    isReady,
    resolvedLanguage,
  };
}
