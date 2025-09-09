import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage:
      "Molimo vas da razmislite o tome da postanete <0>Podržavalac</0> kako biste održali projekat u životu!",
  },
  sponsorDialog: {
    title: "Pomozite da Complexity ostane sjajan!",
    description:
      "Uložili smo bezbroj sati kako bismo Complexity učinili moćnim i doteranim alatom za vas. Vaša podrška direktno podstiče dalji razvoj, nove funkcije i održava sve da radi glatko.",
    descriptionLine2:
      "Ako Complexity dodaje vrednost vašem toku rada, razmislite o doprinosu njegovoj budućnosti!",
    donation: {
      title: "💖 Podržite budući razvoj",
    },
    sponsorship: {
      title: "🌟 Zainteresovani za sponzorstvo?",
      contactEmail: "Kontakt putem e-pošte",
    },
  },
  misc: {
    words: "reči",
    characters: "karakteri",
    rewrite: "Prepravi",
    speakAloud: "Pročitaj naglas",
    stop: "Zaustavi",
  },
  releaseNotes: {
    title: "Ažurirano na v{version}",
    dontShowAgain: "Odbaci i ne prikazuj ponovo za buduća ažuriranja",
    confirmDialog: {
      title: "Potvrdi",
      message:
        "Da li ste sigurni da želite da odbacite i ne prikazujete ponovo za buduća ažuriranja? Ovaj iskačući prozor možete uvek ponovo omogućiti na stranici podešavanja.",
      cancel: "Otkaži",
      confirm: "Razumem",
    },
    dismiss: "Odbaci",
  },
} as const satisfies Translations;
