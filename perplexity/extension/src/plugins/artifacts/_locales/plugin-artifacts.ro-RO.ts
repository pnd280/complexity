import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Clic pentru a vizualiza {name:enum}", {
      enum: {
        name: {
          markdown: "conținutul",
          mermaid: "diagrama",
          plantuml: "diagrama",
          html: "pagina web",
          react: "pagina web",
          markmap: "harta mentală",
        },
      },
    }),
  },
  version: "Versiunea {number:number}",
  toggle: {
    preview: "Previzualizare",
    markdown: "Text brut",
    code: "Cod",
  },
  list: {
    title: "Artefacte în acest fir",
    generating: "Se generează...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 versiune",
          other: "{?} versiuni",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Reîmprospătare",
    openList: "Deschide lista de artefacte",
    openInCodeSandbox: "Deschide în CodeSandbox",
    openInMermaid: "Deschide în Mermaid Live Editor",
    downloadSvg: "Descarcă SVG",
    downloadAsInteractiveHtml: "Descarcă ca HTML interactiv",
    viewAsInteractiveHtml: "Vizualizează ca HTML interactiv",
  },
  error: {
    noSvg: "Nu s-a găsit SVG",
    previewUrl: "Nu s-a putut genera URL-ul de previzualizare",
  },
} as const satisfies Translations;
