import { createHighlighterCore } from "shiki/core";
import type { HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { bundledLanguages } from "shiki/langs";

import { excludedShikiLanguages } from "@/services/shiki/excluded-languages";
import { languageFallbacks } from "@/services/shiki/language-fallbacks";

// Set for O(1) lookup of excluded languages
const excludedLangsSet = new Set(excludedShikiLanguages);

// Special language that bypasses highlighting (built into Shiki core)
const PLAINTEXT_LANG = "text";

// Maps requested language to the actual language registered in Shiki
const languageAliasMap = new Map<string, string>();

/**
 * Checks if a language is available (not excluded and exists in bundledLanguages).
 */
function isLanguageAvailable(lang: string): boolean {
  if (excludedLangsSet.has(lang)) return false;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return bundledLanguages[lang as keyof typeof bundledLanguages] != null;
}

/**
 * Resolves the actual language name to use for highlighting.
 * Returns the mapped language if a fallback was used, or "text" (plaintext) if unknown.
 */
export function resolveLanguage(lang: string): string {
  const normalizedLang = lang.toLowerCase();

  // Check if we have a mapping from a previous ensureLanguage call
  const mapped = languageAliasMap.get(normalizedLang);
  if (mapped) {
    return mapped;
  }

  // Check if it's a directly available language (not excluded)
  if (isLanguageAvailable(normalizedLang)) {
    return normalizedLang;
  }

  // Check fallback
  const fallback = languageFallbacks[normalizedLang];
  if (fallback && isLanguageAvailable(fallback)) {
    return fallback;
  }

  // Unknown language - use plaintext
  return PLAINTEXT_LANG;
}

type HighlighterState = {
  highlighter: HighlighterCore | null;
  loadedLanguages: ReadonlySet<string>;
};

let state: HighlighterState = {
  highlighter: null,
  loadedLanguages: new Set(),
};

let highlighterPromise: Promise<HighlighterCore> | null = null;
const listeners = new Set<() => void>();
const pendingLanguages = new Set<string>();
const failedLanguages = new Set<string>();

function updateState(partial: Partial<HighlighterState>) {
  state = { ...state, ...partial };
  listeners.forEach((cb) => cb());
}

export function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getSnapshot(): HighlighterState {
  return state;
}

async function initHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [
        import("@shikijs/themes/dark-plus"),
        import("@shikijs/themes/light-plus"),
      ],
      langs: [],
      engine: createJavaScriptRegexEngine(),
    }).then((hl) => {
      updateState({ highlighter: hl });
      return hl;
    });
  }
  return highlighterPromise;
}

export function ensureLanguage(lang: string): void {
  const normalizedLang = lang.toLowerCase();

  if (
    state.loadedLanguages.has(normalizedLang) ||
    pendingLanguages.has(normalizedLang) ||
    failedLanguages.has(normalizedLang)
  ) {
    return;
  }

  // Try to get the language loader, checking if available (not excluded)
  let targetLang = normalizedLang;

  if (!isLanguageAvailable(targetLang)) {
    // Try fallback language
    const fallback = languageFallbacks[normalizedLang];
    if (fallback && isLanguageAvailable(fallback)) {
      targetLang = fallback;
    } else {
      // No loader found, mark as failed - will fallback to plaintext when resolving
      failedLanguages.add(normalizedLang);
      languageAliasMap.set(normalizedLang, PLAINTEXT_LANG);
      return;
    }
  }

  const langLoader =
    bundledLanguages[targetLang as keyof typeof bundledLanguages];

  // Store the mapping from requested language to actual language
  if (targetLang !== normalizedLang) {
    languageAliasMap.set(normalizedLang, targetLang);
  }

  pendingLanguages.add(normalizedLang);

  void initHighlighter().then(async (hl) => {
    try {
      const langRegistration = await langLoader();
      await hl.loadLanguage(langRegistration);
      // Mark both the original and target language as loaded
      const newLoaded = new Set([...state.loadedLanguages, normalizedLang]);
      if (targetLang !== normalizedLang) {
        newLoaded.add(targetLang);
      }
      updateState({ loadedLanguages: newLoaded });
    } catch {
      failedLanguages.add(normalizedLang);
    } finally {
      pendingLanguages.delete(normalizedLang);
    }
  });
}

void initHighlighter();
