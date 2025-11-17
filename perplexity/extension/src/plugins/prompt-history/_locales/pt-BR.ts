import type { LanguageMessages } from "@complexity/i18n";

export default {
  clearAllButton: {
    dialog: {
      title: "Limpar Histórico de Prompts",
      message:
        "Tem certeza de que deseja limpar todo o histórico de prompts? Esta ação não pode ser desfeita.",
      actions: {
        cancel: "Cancelar",
        confirm: "Limpar Tudo",
      },
    },
  },
  search: {
    placeholder: "Pesquisar no histórico de prompts...",
    noResults: "Nenhum resultado encontrado",
  },
} as const satisfies LanguageMessages;
