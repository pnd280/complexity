import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Kliknutím zobrazíte {name:enum}", {
      enum: {
        name: {
          markdown: "obsah",
          mermaid: "diagram",
          plantuml: "diagram",
          html: "webovou stránku",
          react: "webovou stránku",
          markmap: "myšlenkovou mapu",
        },
      },
    }),
  },
  version: "Verze {number:number}",
  toggle: {
    preview: "Náhled",
    markdown: "Surový text",
    code: "Kód",
  },
  list: {
    title: "Artefakty v tomto vlákně",
    generating: "Generování...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 verze",
          other: "{?} verzí",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Obnovit",
    openList: "Otevřít seznam artefaktů",
    openInCodeSandbox: "Otevřít v CodeSandbox",
    openInMermaid: "Otevřít v Mermaid Live Editoru",
    downloadSvg: "Stáhnout SVG",
    downloadAsInteractiveHtml: "Stáhnout jako interaktivní HTML",
    viewAsInteractiveHtml: "Zobrazit jako interaktivní HTML",
  },
  error: {
    noSvg: "Nenalezeno žádné SVG",
    previewUrl: "Nepodařilo se vygenerovat URL náhledu",
  },
} as const satisfies Translations;
