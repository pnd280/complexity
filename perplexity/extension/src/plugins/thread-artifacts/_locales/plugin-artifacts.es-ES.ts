import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/thread-artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Haz clic para ver {name:enum}", {
      enum: {
        name: {
          markdown: "contenido",
          mermaid: "diagrama",
          plantuml: "diagrama",
          html: "página web",
          react: "página web",
          markmap: "mapa mental",
        },
      },
    }),
  },
  version: "Versión {number:number}",
  toggle: {
    preview: "Vista previa",
    markdown: "Texto sin formato",
    code: "Código",
  },
  list: {
    title: "Artefactos en este hilo",
    generating: "Generando...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 versión",
          other: "{?} versiones",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Actualizar",
    openList: "Abrir lista de artefactos",
    openInCodeSandbox: "Abrir en CodeSandbox",
    openInMermaid: "Abrir en Mermaid Live Editor",
    downloadSvg: "Descargar SVG",
    downloadAsInteractiveHtml: "Descargar como HTML interactivo",
    viewAsInteractiveHtml: "Ver como HTML interactivo",
  },
  error: {
    noSvg: "No se encontró SVG",
    previewUrl: "No se pudo generar la URL de vista previa",
  },
} as const satisfies Translations;
