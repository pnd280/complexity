import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Exportar",
  format: {
    label: "Escolher formato",
    placeholder: "Selecione um formato",
  },
  includeCitations: "Incluir citações",
  actions: {
    download: "Baixar",
    copy: "Copiar",
  },
  errors: {
    downloadFailed: {
      title: "❌ Falha ao baixar",
      unknownError: "Ocorreu um erro desconhecido",
    },
  },
} as const satisfies Translations;
