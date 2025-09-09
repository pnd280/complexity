import { dt } from "@complexity/i18n";

import type { Translations } from "@/plugins/artifacts/_locales/index";

export default {
  placeholder: {
    description: dt("Κάντε κλικ για να δείτε {name:enum}", {
      enum: {
        name: {
          markdown: "περιεχόμενο",
          mermaid: "διάγραμμα",
          plantuml: "διάγραμμα",
          html: "ιστοσελίδα",
          react: "ιστοσελίδα",
          markmap: "νοητικό χάρτη",
        },
      },
    }),
  },
  version: "Έκδοση {number:number}",
  toggle: {
    preview: "Προεπισκόπηση",
    markdown: "Ακατέργαστο κείμενο",
    code: "Κώδικας",
  },
  list: {
    title: "Τεχνουργήματα σε αυτό το νήμα",
    generating: "Δημιουργία...",
    versions: dt("{count:plural}", {
      plural: {
        count: {
          1: "1 έκδοση",
          other: "{?} εκδόσεις",
        },
      },
    }),
  },
  tooltip: {
    refresh: "Ανανέωση",
    openList: "Άνοιγμα λίστας τεχνουργημάτων",
    openInCodeSandbox: "Άνοιγμα στο CodeSandbox",
    openInMermaid: "Άνοιγμα στο Mermaid Live Editor",
    downloadSvg: "Λήψη SVG",
    downloadAsInteractiveHtml: "Λήψη ως διαδραστικό HTML",
    viewAsInteractiveHtml: "Προβολή ως διαδραστικό HTML",
  },
  error: {
    noSvg: "Δεν βρέθηκε SVG",
    previewUrl: "Αποτυχία δημιουργίας URL προεπισκόπησης",
  },
} as const satisfies Translations;
