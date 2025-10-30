import type { Translations } from "@/plugins/thread-export/_locales/index";

export default {
  action: "Exportar",
  format: {
    label: "Escolher formato",
    placeholder: "Selecione um formato",
  },
  includeCitations: "Incluir citações",
  actions: {
    download: "Descarregar",
    largeFileDownloadPrompt: {
      title: "O seu descarregamento está pronto",
      description: "Clique aqui para iniciar o descarregamento",
    },
    copy: "Copiar",
  },
  errors: {
    downloadFailed: {
      title: "❌ Falha ao descarregar",
      unknownError: "Ocorreu um erro desconhecido",
    },
  },
} as const satisfies Translations;
