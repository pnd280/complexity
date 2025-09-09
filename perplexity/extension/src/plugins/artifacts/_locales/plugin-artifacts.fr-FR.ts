import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Cliquez pour voir {name:enum}", {
      enum: {
        name: {
          markdown: "le contenu",
          mermaid: "le diagramme",
          plantuml: "le diagramme",
          html: "la page web",
          react: "la page web",
          markmap: "la carte mentale",
        },
      },
    }),
  },
  version: "Version {number:number}",
  toggle: {
    preview: "Aperçu",
    markdown: "Texte brut",
    code: "Code",
  },
  list: {
    title: "Artefacts dans ce fil",
    generating: "Génération en cours...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 version",
          other: "{?} versions",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Actualiser",
    openList: "Ouvrir la liste des artefacts",
    openInCodeSandbox: "Ouvrir dans CodeSandbox",
    openInMermaid: "Ouvrir dans Mermaid Live Editor",
    downloadSvg: "Télécharger SVG",
    downloadAsInteractiveHtml: "Télécharger en HTML interactif",
    viewAsInteractiveHtml: "Voir en HTML interactif",
  },
  error: {
    noSvg: "Aucun SVG trouvé",
    previewUrl: "Échec de génération de l'URL d'aperçu",
  },
} as const satisfies Translations;
