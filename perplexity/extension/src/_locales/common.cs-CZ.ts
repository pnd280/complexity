import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage: "Přispějte, abyste udrželi projekt naživu!",
  },
  sponsorDialog: {
    title: "Pomozte udržet Complexity skvělé!",
    description:
      "Nespočet hodin bylo věnováno tomu, aby byl Complexity výkonným a propracovaným nástrojem pro vás. Vaše podpora přímo pohání další vývoj, nové funkce a udržuje vše v chodu.",
    descriptionLine2:
      "Pokud Complexity přináší hodnotu do vašeho pracovního postupu, zvažte prosím příspěvek na jeho budoucnost!",
    cometAffiliate: {
      title: "Vyzkoušejte Comet - Získejte bezplatné předplatné <0/>!",
      description:
        "Vyzkoušejte Comet - nový prohlížeč od Perplexity - a získejte bezplatné předplatné <0/> a zároveň přímo přispějte k vývoji Complexity.",
      claimButton: "Získat nyní",
      dismissButton: "Zavřít",
    },
    donation: {
      title: "💖 Podpořte budoucí vývoj",
    },
    sponsorship: {
      title: "🌟 Máte zájem o sponzorství?",
      contactEmail: "Kontaktujte e-mailem",
    },
  },
  misc: {
    words: "slova",
    characters: "znaky",
    rewrite: "Přepsat",
    speakAloud: "Číst nahlas",
    stop: "Zastavit",
  },
  releaseNotes: {
    title: "Aktualizováno na v{version}",
    dontShowAgain: "Zavřít a již nezobrazovat pro budoucí aktualizace",
    confirmDialog: {
      title: "Potvrdit",
      message:
        "Opravdu chcete zavřít a již nezobrazovat pro budoucí aktualizace? Toto okno můžete kdykoli znovu povolit na stránce nastavení.",
      cancel: "Zrušit",
      confirm: "Rozumím",
    },
    dismiss: "Zavřít",
  },
} as const satisfies Translations;
