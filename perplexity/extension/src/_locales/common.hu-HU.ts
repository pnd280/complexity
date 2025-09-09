import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage:
      "Kérjük, fontold meg, hogy <0>Támogató</0> leszel, hogy a projekt életben maradjon!",
  },
  sponsorDialog: {
    title: "Segíts megőrizni a Complexity nagyszerűségét!",
    description:
      "Számtalan órát fektettünk abba, hogy a Complexity egy erős és kifinomult eszköz legyen számodra. A támogatásod közvetlenül segíti a folyamatos fejlesztést, az új funkciókat és mindent gördülékenyen tart.",
    descriptionLine2:
      "Ha a Complexity értéket ad a munkafolyamatodhoz, kérjük, fontold meg a jövőjének támogatását!",
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
