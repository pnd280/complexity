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
    largeFileDownloadPrompt: {
      title: "Su descarga está lista",
      description: "Haga clic aquí para iniciar la descarga",
    },
    copy: "Copiar",
  },
  waiting: {
    title: "Por favor espere...",
    description: "Extrayendo contenido, esto puede llevar un momento",
  },
  errors: {
    downloadFailed: {
      title: "❌ Error al descargar",
      unknownError: "Ocurrió un error desconocido",
    },
    copyFailed: {
      title: "❌ Error al copiar",
      unknownError: "Ocurrió un error desconocido",
    },
  },
} as const satisfies Translations;
