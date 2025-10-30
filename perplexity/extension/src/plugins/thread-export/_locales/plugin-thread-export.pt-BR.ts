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
    largeFileDownloadPrompt: {
      title: "Seu download está pronto",
      description: "Clique aqui para iniciar o download",
    },
    copy: "Copiar",
  },
  errors: {
    downloadFailed: {
      title: "❌ Falha ao baixar",
      unknownError: "Ocorreu um erro desconhecido",
    },
  },
} as const satisfies Translations;
