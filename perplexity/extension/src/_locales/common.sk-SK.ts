import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage: "Prispejte, aby projekt zostal nažive!",
  },
  sponsorDialog: {
    title: "Pomôžte udržať Complexity skvelý!",
    description:
      "Nespočetné množstvo hodín bolo venovaných tomu, aby bol Complexity výkonným a vyladeným nástrojom pre vás. Vaša podpora priamo poháňa ďalší vývoj, nové funkcie a udržiava všetko v chode.",
    descriptionLine2:
      "Ak Complexity pridáva hodnotu vášmu pracovnému postupu, zvážte, prosím, príspevok na jeho budúcnosť!",
    cometAffiliate: {
      title: "Vyskúšajte Comet - Získajte bezplatné predplatné <0/>!",
      description:
        "Vyskúšajte Comet - nový prehliadač od Perplexity - a získajte bezplatné predplatné <0/> a zároveň priamo prispejte k vývoju Complexity.",
      claimButton: "Získať teraz",
      dismissButton: "Zavrieť",
    },
    donation: {
      title: "💖 Podporte budúci vývoj",
    },
    sponsorship: {
      title: "🌟 Máte záujem o sponzorstvo?",
      contactEmail: "Kontaktujte e-mailom",
    },
  },
  misc: {
    words: "slová",
    characters: "znaky",
    rewrite: "Prepísať",
    speakAloud: "Čítať nahlas",
    stop: "Zastaviť",
  },
  releaseNotes: {
    title: "Aktualizované na v{version}",
    dontShowAgain: "Zavrieť a už nezobrazovať pre budúce aktualizácie",
    confirmDialog: {
      title: "Potvrdiť",
      message:
        "Naozaj chcete zavrieť a už nezobrazovať pre budúce aktualizácie? Toto okno môžete kedykoľvek znova povoliť na stránke nastavení.",
      cancel: "Zrušiť",
      confirm: "Rozumiem",
    },
    dismiss: "Zavrieť",
  },
} as const satisfies Translations;
