import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/_thread/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Kliknite pre zobrazenie {name:enum}", {
      enum: {
        name: {
          markdown: "obsahu",
          mermaid: "diagramu",
          plantuml: "diagramu",
          html: "webovej stránky",
          react: "webovej stránky",
          markmap: "myšlienkovej mapy",
        },
      },
    }),
  },
  version: "Verzia {number:number}",
  toggle: {
    preview: "Náhľad",
    markdown: "Surový text",
    code: "Kód",
  },
  list: {
    title: "Artefakty v tomto vlákne",
    generating: "Generuje sa...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 verzia",
          other: "{?} verzií",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Obnoviť",
    openList: "Otvoriť zoznam artefaktov",
    openInCodeSandbox: "Otvoriť v CodeSandbox",
    openInMermaid: "Otvoriť v Mermaid Live Editor",
    downloadSvg: "Stiahnuť SVG",
    downloadAsInteractiveHtml: "Stiahnuť ako interaktívny HTML",
    viewAsInteractiveHtml: "Zobraziť ako interaktívny HTML",
  },
  error: {
    noSvg: "Nenašlo sa žiadne SVG",
    previewUrl: "Nepodarilo sa vygenerovať URL náhľadu",
  },
} as const satisfies Translations;
