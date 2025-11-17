import type { Translations } from "@/entrypoints/_locales/index";

export default {
  sidebar: {
    supporterMessage: "Adj adományt, hogy életben maradjon a projekt!",
  },
  sponsorDialog: {
    title: "Segíts megőrizni a Complexity nagyszerűségét!",
    description:
      "Számtalan óra került befektetésre, hogy a Complexity egy erős és kifinomult eszköz legyen számodra. A támogatásod közvetlenül segíti a folyamatos fejlesztést, az új funkciókat és mindent gördülékenyen tart.",
    descriptionLine2:
      "Ha a Complexity értéket ad a munkafolyamatodhoz, kérjük, fontold meg a jövőjének támogatását!",
    cometAffiliate: {
      title: "Próbáld ki a Comet-et - Szerezz ingyenes <0/> előfizetést!",
      description:
        "Próbáld ki a Comet-et - a Perplexity új böngészőjét - és szerezz ingyenes <0/> előfizetést, miközben közvetlenül hozzájárulsz a Complexity fejlesztéséhez.",
      claimButton: "Igényelj most",
      dismissButton: "Elutasítás",
    },
    donation: {
      title: "💖 Támogasd a jövőbeli fejlesztést",
    },
    sponsorship: {
      title: "🌟 Érdekel a szponzoráció?",
      contactEmail: "Kapcsolat Emailben",
    },
  },
  misc: {
    words: "szavak",
    characters: "karakterek",
    rewrite: "Átírás",
    speakAloud: "Felolvasás",
    stop: "Leállítás",
  },
  releaseNotes: {
    title: "Frissítve v{version}-ra",
    dontShowAgain:
      "Elutasítás és ne jelenjen meg újra a jövőbeli frissítéseknél",
    confirmDialog: {
      title: "Megerősítés",
      message:
        "Biztos vagy benne, hogy elutasítod és nem jelenik meg újra a jövőbeli frissítéseknél? Ezt a felugró ablakot bármikor újra engedélyezheted a beállítások oldalon.",
      cancel: "Mégse",
      confirm: "Értem",
    },
    dismiss: "Elutasítás",
  },
} as const satisfies Translations;
