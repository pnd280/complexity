import type { Translations } from "@/plugins/_thread/export/_locales/index";

export default {
  action: "Eksportuj",
  format: {
    label: "Wybierz format",
    placeholder: "Wybierz format",
  },
  includeCitations: "Dołącz cytaty",
  actions: {
    download: "Pobierz",
    largeFileDownloadPrompt: {
      title: "Twoje pobieranie jest gotowe",
      description: "Kliknij tutaj, aby rozpocząć pobieranie",
    },
    copy: "Kopiuj",
  },
  waiting: {
    title: "Proszę czekać...",
    description: "Wyodrębnianie treści, może to chwilę potrwać",
  },
  errors: {
    downloadFailed: {
      title: "❌ Pobieranie nie powiodło się",
      unknownError: "Wystąpił nieznany błąd",
    },
    copyFailed: {
      title: "❌ Kopiowanie nie powiodło się",
      unknownError: "Wystąpił nieznany błąd",
    },
  },
} as const satisfies Translations;
