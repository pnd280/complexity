import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage:
      "Napravite donaciju kako biste održali projekt na životu!",
  },
  sponsorDialog: {
    title: "Pomozite Complexityju da ostane sjajan!",
    description:
      "Bezbroj sati je uloženo kako bi se Complexity učinio moćnim i dotjeranim alatom za vas. Vaša podrška izravno potiče daljnji razvoj, nove značajke i održava sve u pogonu.",
    descriptionLine2:
      "Ako Complexity dodaje vrijednost vašem tijeku rada, razmislite o doprinosu njegovoj budućnosti!",
    cometAffiliate: {
      title: "🎁 Nabavite besplatni <0>PERPLEXITY PRO</0>!",
      description:
        "Registracijom putem ovog partnerskog linka, dobit ćete besplatnu <0>PERPLEXITY PRO</0> pretplatu za prvi mjesec i istovremeno izravno doprinijeti razvoju Complexityja.",
      claimButton: "Zatražite sada",
      dismissButton: "Odbaci",
    },
    donation: {
      title: "💖 Podržite budući razvoj",
    },
    sponsorship: {
      title: "🌟 Zainteresirani za sponzorstvo?",
      contactEmail: "Kontakt putem e-pošte",
    },
  },
  misc: {
    words: "riječi",
    characters: "znakovi",
    rewrite: "Prepiši",
    speakAloud: "Čitaj naglas",
    stop: "Zaustavi",
  },
  releaseNotes: {
    title: "Ažurirano na v{version}",
    dontShowAgain: "Odbaci i ne prikazuj ponovno za buduća ažuriranja",
    confirmDialog: {
      title: "Potvrdi",
      message:
        "Jeste li sigurni da želite odbaciti i ne prikazivati ponovno za buduća ažuriranja? Ovaj skočni prozor možete uvijek ponovno omogućiti na stranici postavki.",
      cancel: "Odustani",
      confirm: "Razumijem",
    },
    dismiss: "Odbaci",
  },
} as const satisfies Translations;
