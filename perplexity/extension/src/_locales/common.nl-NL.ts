import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage:
      "Overweeg alstublieft om een <0>Supporter</0> te worden om het project in leven te houden!",
  },
  sponsorDialog: {
    title: "Complexity Heeft Jouw Hulp Nodig!",
    description:
      "Deze verfijnde en functierijke extensie is het resultaat van talloze uren ontwikkeling en toegewijde verbetering. Als je de aandacht voor detail en voortdurende verbeteringen waardeert, overweeg dan om de ontwikkeling te ondersteunen",
    descriptionLine2:
      "Als Complexity waarde toevoegt aan je workflow, overweeg dan om bij te dragen aan de toekomst ervan!",
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
