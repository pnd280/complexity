import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage:
      "Zvážte, prosím, že sa stanete <0>Podporovateľom</0>, aby projekt zostal nažive!",
  },
  sponsorDialog: {
    title: "Pomôžte udržať Complexity skvelý!",
    description:
      "Venovali sme nespočetné množstvo hodín tomu, aby bol Complexity výkonným a vyladeným nástrojom pre vás. Vaša podpora priamo poháňa ďalší vývoj, nové funkcie a udržiava všetko v chode.",
    descriptionLine2:
      "Ak Complexity pridáva hodnotu vášmu pracovnému postupu, zvážte, prosím, príspevok na jeho budúcnosť!",
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
