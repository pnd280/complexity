import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage: "Faça uma doação para manter o projeto vivo!",
  },
  sponsorDialog: {
    title: "Ajude a manter o Complexity incrível!",
    description:
      "Inúmeras horas foram dedicadas para tornar o Complexity uma ferramenta poderosa e polida para si. O seu apoio alimenta diretamente o desenvolvimento contínuo, novas funcionalidades e mantém tudo a funcionar sem problemas.",
    descriptionLine2:
      "Se o Complexity acrescenta valor ao seu fluxo de trabalho, por favor considere contribuir para o seu futuro!",
    cometAffiliate: {
      title: "🎁 Obtenha o seu <0>PERPLEXITY PRO</0> grátis!",
      description:
        "Ao inscrever-se através deste link de afiliado, receberá uma subscrição <0>PERPLEXITY PRO</0> gratuita no primeiro mês e, entretanto, contribuirá diretamente para o desenvolvimento do Complexity.",
      claimButton: "Reivindique agora",
      dismissButton: "Dispensar",
    },
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
