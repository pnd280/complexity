import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage:
      "Por favor, considere tornar-se um <0>Apoiador</0> para manter o projeto vivo!",
  },
  sponsorDialog: {
    title: "Ajude a manter o Complexity incrível!",
    description:
      "Dedicámos inúmeras horas para tornar o Complexity uma ferramenta poderosa e polida para si. O seu apoio alimenta diretamente o desenvolvimento contínuo, novas funcionalidades e mantém tudo a funcionar sem problemas.",
    descriptionLine2:
      "Se o Complexity acrescenta valor ao seu fluxo de trabalho, por favor considere contribuir para o seu futuro!",
    donation: {
      title: "💖 Apoie o desenvolvimento futuro",
    },
    sponsorship: {
      title: "🌟 Interessado em patrocínio?",
      contactEmail: "Contactar por Email",
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
        "Tem a certeza de que pretende dispensar e não mostrar novamente para futuras atualizações? Pode sempre reativar este popup na página de definições.",
      cancel: "Cancelar",
      confirm: "Compreendo",
    },
    dismiss: "Dispensar",
  },
} as const satisfies Translations;
