import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/_thread/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Clique para visualizar {name:enum}", {
      enum: {
        name: {
          markdown: "conteúdo",
          mermaid: "diagrama",
          plantuml: "diagrama",
          html: "página web",
          react: "página web",
          markmap: "mapa mental",
        },
      },
    }),
  },
  version: "Versão {number:number}",
  toggle: {
    preview: "Pré-visualização",
    markdown: "Texto bruto",
    code: "Código",
  },
  list: {
    title: "Artefactos neste tópico",
    generating: "A gerar...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 versão",
          other: "{?} versões",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Atualizar",
    openList: "Abrir lista de artefactos",
    openInCodeSandbox: "Abrir no CodeSandbox",
    openInMermaid: "Abrir no Mermaid Live Editor",
    downloadSvg: "Descarregar SVG",
    downloadAsInteractiveHtml: "Descarregar como HTML interativo",
    viewAsInteractiveHtml: "Visualizar como HTML interativo",
  },
  error: {
    noSvg: "Nenhum SVG encontrado",
    previewUrl: "Falha ao gerar URL de pré-visualização",
  },
} as const satisfies Translations;
