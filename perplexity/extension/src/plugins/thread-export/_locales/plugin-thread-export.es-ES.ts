import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Exportar",
  format: {
    label: "Elegir formato",
    placeholder: "Seleccionar un formato",
  },
  includeCitations: "Incluir citas",
  actions: {
    download: "Descargar",
    copy: "Copiar",
  },
  errors: {
    downloadFailed: {
      title: "❌ Error al descargar",
      unknownError: "Ocurrió un error desconocido",
    },
  },
} as const satisfies Translations;
