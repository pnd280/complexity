import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/_thread/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Clicca per visualizzare {name:enum}", {
      enum: {
        name: {
          markdown: "contenuto",
          mermaid: "diagramma",
          plantuml: "diagramma",
          html: "pagina web",
          react: "pagina web",
          markmap: "mappa mentale",
        },
      },
    }),
  },
  version: "Versione {number:number}",
  toggle: {
    preview: "Anteprima",
    markdown: "Testo grezzo",
    code: "Codice",
  },
  list: {
    title: "Artefatti in questo thread",
    generating: "Generazione in corso...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 versione",
          other: "{?} versioni",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Aggiorna",
    openList: "Apri lista artefatti",
    openInCodeSandbox: "Apri in CodeSandbox",
    openInMermaid: "Apri in Mermaid Live Editor",
    downloadSvg: "Scarica SVG",
    downloadAsInteractiveHtml: "Scarica come HTML interattivo",
    viewAsInteractiveHtml: "Visualizza come HTML interattivo",
  },
  error: {
    noSvg: "Nessun SVG trovato",
    previewUrl: "Impossibile generare URL di anteprima",
  },
} as const satisfies Translations;
