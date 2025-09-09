import type { Translations } from "@/plugins/export-thread/_locales/index";

export default {
  action: "Exportar",
  format: {
    label: "Escolher formato",
    placeholder: "Selecione um formato",
  },
  includeCitations: "Incluir citações",
  actions: {
    download: "Descarregar",
    copy: "Copiar",
  },
  errors: {
    downloadFailed: {
      title: "❌ Falha ao descarregar",
      unknownError: "Ocorreu um erro desconhecido",
    },
  },
} as const satisfies Translations;
