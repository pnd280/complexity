import type { Translations } from "@/entrypoints/_locales/index";

export default {
  sidebar: {
    supporterMessage: "Doe een donatie om het project in leven te houden!",
  },
  sponsorDialog: {
    title: "Complexity Heeft Jouw Hulp Nodig!",
    description:
      "Talloze uren zijn besteed aan het maken van Complexity tot een krachtig en verfijnd hulpmiddel voor jou. Jouw steun voedt direct de voortdurende ontwikkeling, nieuwe functies en houdt alles soepel draaiende.",
    descriptionLine2:
      "Als Complexity waarde toevoegt aan je workflow, overweeg dan om bij te dragen aan de toekomst ervan!",
    cometAffiliate: {
      title: "Probeer Comet - Krijg een gratis <0/>-abonnement!",
      description:
        "Probeer Comet - een nieuwe browser van Perplexity - en krijg een gratis <0/>-abonnement en draag ondertussen direct bij aan de ontwikkeling van Complexity.",
      claimButton: "Claim het nu",
      dismissButton: "Sluiten",
    },
    donation: {
      title: "💖 Doe een donatie",
    },
    sponsorship: {
      title: "🌟 Heb je een voorstel voor langdurige sponsoring?",
      contactEmail: "Contact via e-mail",
    },
  },
  misc: {
    words: "woorden",
    characters: "tekens",
    rewrite: "Herschrijven",
    speakAloud: "Hardop voorlezen",
    stop: "Stoppen",
  },
  releaseNotes: {
    title: "Bijgewerkt naar v{version}",
    dontShowAgain: "Sluiten en niet meer tonen voor toekomstige updates",
    confirmDialog: {
      title: "Bevestigen",
      message:
        "Weet je zeker dat je wilt sluiten en niet meer wilt tonen voor toekomstige updates? Je kunt deze pop-up altijd opnieuw inschakelen op de instellingenpagina.",
      cancel: "Annuleren",
      confirm: "Ik begrijp het",
    },
    dismiss: "Sluiten",
  },
} as const satisfies Translations;
