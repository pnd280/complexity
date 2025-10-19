import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage: "Przekaż darowiznę, aby utrzymać projekt przy życiu!",
  },
  sponsorDialog: {
    title: "Pomóż utrzymać Complexity na wysokim poziomie!",
    description:
      "Niezliczone godziny zostały poświęcone, aby uczynić Complexity potężnym i dopracowanym narzędziem dla Ciebie. Twoje wsparcie bezpośrednio napędza dalszy rozwój, nowe funkcje i utrzymanie wszystkiego w ruchu.",
    descriptionLine2:
      "Jeśli Complexity wnosi wartość do Twojego workflow, rozważ wsparcie jego przyszłości!",
    cometAffiliate: {
      title: "🎁 Zdobądź darmowy <0>PERPLEXITY PRO</0>!",
      description:
        "Rejestrując się za pośrednictwem tego linku partnerskiego, otrzymasz darmową subskrypcję <0>PERPLEXITY PRO</0> na pierwszy miesiąc i jednocześnie bezpośrednio przyczynisz się do rozwoju Complexity.",
      claimButton: "Odbierz teraz",
      dismissButton: "Odrzuć",
    },
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
