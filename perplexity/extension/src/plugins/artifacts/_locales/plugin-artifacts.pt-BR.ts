import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/artifacts/_locales/index";

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
    preview: "Visualização",
    markdown: "Texto bruto",
    code: "Código",
  },
  list: {
    title: "Artefatos neste tópico",
    generating: "Gerando...",
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
    openList: "Abrir lista de artefatos",
    openInCodeSandbox: "Abrir no CodeSandbox",
    openInMermaid: "Abrir no Mermaid Live Editor",
    downloadSvg: "Baixar SVG",
    downloadAsInteractiveHtml: "Baixar como HTML interativo",
    viewAsInteractiveHtml: "Visualizar como HTML interativo",
  },
  error: {
    noSvg: "Nenhum SVG encontrado",
    previewUrl: "Falha ao gerar URL de visualização",
  },
} as const satisfies Translations;
