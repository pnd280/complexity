import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/_thread/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Kliknij, aby zobaczyć {name:enum}", {
      enum: {
        name: {
          markdown: "treść",
          mermaid: "diagram",
          plantuml: "diagram",
          html: "stronę internetową",
          react: "stronę internetową",
          markmap: "mapę myśli",
        },
      },
    }),
  },
  version: "Wersja {number:number}",
  toggle: {
    preview: "Podgląd",
    markdown: "Surowy tekst",
    code: "Kod",
  },
  list: {
    title: "Artefakty w tym wątku",
    generating: "Generowanie...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 wersja",
          other: "{?} wersji",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Odśwież",
    openList: "Otwórz listę artefaktów",
    openInCodeSandbox: "Otwórz w CodeSandbox",
    openInMermaid: "Otwórz w Mermaid Live Editor",
    downloadSvg: "Pobierz SVG",
    downloadAsInteractiveHtml: "Pobierz jako interaktywny HTML",
    viewAsInteractiveHtml: "Wyświetl jako interaktywny HTML",
  },
  error: {
    noSvg: "Nie znaleziono SVG",
    previewUrl: "Nie udało się wygenerować URL podglądu",
  },
} as const satisfies Translations;
