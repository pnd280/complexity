import type { Translations } from "@/entrypoints/_locales/index";

export default {
  sidebar: {
    supporterMessage: "Faites un don pour soutenir le projet !",
  },
  sponsorDialog: {
    title: "Aidez Complexity à rester génial !",
    description:
      "D'innombrables heures ont été consacrées à faire de Complexity un outil puissant et soigné pour vous. Votre soutien alimente directement le développement continu, de nouvelles fonctionnalités et le bon fonctionnement de tout.",
    descriptionLine2:
      "Si Complexity ajoute de la valeur à votre flux de travail, merci d'envisager de contribuer à son avenir !",
    cometAffiliate: {
      title: "Essayez Comet - Obtenez un abonnement <0/> gratuit!",
      description:
        "Essayez Comet - le nouveau navigateur de Perplexity - et obtenez un abonnement <0/> gratuit et contribuez directement au développement de Complexity.",
      claimButton: "Réclamez-le maintenant",
      dismissButton: "Ignorer",
    },
    donation: {
      title: "💖 Soutenir le développement futur",
    },
    sponsorship: {
      title: "🌟 Intéressé par un sponsoring ?",
      contactEmail: "Contact par Email",
    },
  },
  misc: {
    words: "mots",
    characters: "caractères",
    rewrite: "Réécrire",
    speakAloud: "Lire à voix haute",
    stop: "Arrêter",
  },
  releaseNotes: {
    title: "Mis à jour vers v{version}",
    dontShowAgain: "Ignorer et ne plus afficher pour les futures mises à jour",
    confirmDialog: {
      title: "Confirmer",
      message:
        "Êtes-vous sûr de vouloir ignorer et ne plus afficher pour les futures mises à jour ? Vous pouvez toujours réactiver cette popup dans la page des paramètres.",
      cancel: "Annuler",
      confirm: "Je comprends",
    },
    dismiss: "Ignorer",
  },
} as const satisfies Translations;
