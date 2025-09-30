import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/thread-artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Kattintson a(z) {name:enum} megtekintéséhez", {
      enum: {
        name: {
          markdown: "tartalom",
          mermaid: "diagram",
          plantuml: "diagram",
          html: "weboldal",
          react: "weboldal",
          markmap: "gondolattérkép",
        },
      },
    }),
  },
  version: "Verzió {number:number}",
  toggle: {
    preview: "Előnézet",
    markdown: "Nyers szöveg",
    code: "Kód",
  },
  list: {
    title: "Műtermékek ebben a szálban",
    generating: "Generálás...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 verzió",
          other: "{?} verzió",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Frissítés",
    openList: "Műtermékek listájának megnyitása",
    openInCodeSandbox: "Megnyitás CodeSandbox-ban",
    openInMermaid: "Megnyitás Mermaid Live Editor-ban",
    downloadSvg: "SVG letöltése",
    downloadAsInteractiveHtml: "Letöltés interaktív HTML-ként",
    viewAsInteractiveHtml: "Megtekintés interaktív HTML-ként",
  },
  error: {
    noSvg: "Nem található SVG",
    previewUrl: "Nem sikerült előnézeti URL-t generálni",
  },
} as const satisfies Translations;
