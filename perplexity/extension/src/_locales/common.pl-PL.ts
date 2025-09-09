import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage:
      "Prosimy o rozważenie zostania <0>Wspierającym</0>, aby utrzymać projekt przy życiu!",
  },
  sponsorDialog: {
    title: "Pomóż utrzymać Complexity na wysokim poziomie!",
    description:
      "Poświęciliśmy niezliczone godziny, aby uczynić Complexity potężnym i dopracowanym narzędziem dla Ciebie. Twoje wsparcie bezpośrednio napędza dalszy rozwój, nowe funkcje i utrzymanie wszystkiego w ruchu.",
    descriptionLine2:
      "Jeśli Complexity wnosi wartość do Twojego workflow, rozważ wsparcie jego przyszłości!",
    donation: {
      title: "💖 Wspieraj przyszły rozwój",
    },
    sponsorship: {
      title: "🌟 Zainteresowany sponsoringiem?",
      contactEmail: "Kontakt przez e-mail",
    },
  },
  misc: {
    words: "słowa",
    characters: "znaki",
    rewrite: "Przepisz",
    speakAloud: "Czytaj na głos",
    stop: "Zatrzymaj",
  },
  releaseNotes: {
    title: "Zaktualizowano do v{version}",
    dontShowAgain:
      "Odrzuć i nie pokazuj ponownie przy przyszłych aktualizacjach",
    confirmDialog: {
      title: "Potwierdź",
      message:
        "Czy na pewno chcesz odrzucić i nie pokazywać ponownie przy przyszłych aktualizacjach? Możesz ponownie włączyć to okno w ustawieniach.",
      cancel: "Anuluj",
      confirm: "Rozumiem",
    },
    dismiss: "Odrzuć",
  },
} as const satisfies Translations;
