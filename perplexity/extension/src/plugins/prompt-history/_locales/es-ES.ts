import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "Borrar historial de prompts",
      message:
        "¿Estás seguro de que deseas borrar todo el historial de prompts? Esta acción no se puede deshacer.",
      actions: {
        cancel: "Cancelar",
        confirm: "Borrar todo",
      },
    },
  },
  search: {
    placeholder: "Buscar en el historial de prompts...",
    noResults: "No se encontraron resultados",
  },
} as const satisfies LanguageMessages;
