import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage:
      "Por favor, considere tornar-se um <0>Apoiador</0> para manter o projeto vivo!",
  },
  sponsorDialog: {
    title: "Ajude a manter o Complexity incrível!",
    description:
      "Dedicamos inúmeras horas para tornar o Complexity uma ferramenta poderosa e refinada para você. Seu apoio alimenta diretamente o desenvolvimento contínuo, novos recursos e mantém tudo funcionando perfeitamente.",
    descriptionLine2:
      "Se o Complexity agrega valor ao seu fluxo de trabalho, por favor, considere contribuir para o seu futuro!",
    donation: {
      title: "💖 Apoie o desenvolvimento futuro",
    },
    sponsorship: {
      title: "🌟 Interessado em patrocínio?",
      contactEmail: "Contato por Email",
    },
  },
  misc: {
    words: "palavras",
    characters: "caracteres",
    rewrite: "Reescrever",
    speakAloud: "Ler em voz alta",
    stop: "Parar",
  },
  releaseNotes: {
    title: "Atualizado para v{version}",
    dontShowAgain:
      "Dispensar e não mostrar novamente para futuras atualizações",
    confirmDialog: {
      title: "Confirmar",
      message:
        "Tem certeza de que deseja dispensar e não mostrar novamente para futuras atualizações? Você sempre pode reativar este popup na página de configurações.",
      cancel: "Cancelar",
      confirm: "Entendi",
    },
    dismiss: "Dispensar",
  },
} as const satisfies Translations;
