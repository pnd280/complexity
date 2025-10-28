import type { LanguageMessages } from "@complexity/i18n";

export default {
  sidebar: {
    supporterMessage: "Make a donation to keep the project alive!",
  },
  sponsorDialog: {
    title: "Help keep Complexity awesome!",
    description:
      "Countless hours have been poured into making Complexity a powerful and polished tool for you. Your support directly fuels ongoing development, new features, and keeping everything running smoothly.",
    descriptionLine2:
      "If Complexity adds value to your workflow, please consider contributing to its future!",
    cometAffiliate: {
      title: "Try Comet - Get a free <0/> subscription!",
      description:
        "Try out Comet - a new browser from Perplexity - and get a free <0/> subscription and meanwhile directly contribute to the development of Complexity.",
      claimButton: "Claim it now",
      dismissButton: "Dismiss",
    },
    donation: {
      title: "💖 Support future development",
    },
    sponsorship: {
      title: "🌟 Interested in Sponsorship?",
      contactEmail: "Contact via Email",
    },
  },
  misc: {
    words: "words",
    characters: "characters",
    rewrite: "Rewrite",
    speakAloud: "Speak aloud",
    stop: "Stop",
  },
  releaseNotes: {
    title: "Updated to v{version}",
    dontShowAgain: "Dismiss and don't show again for future updates",
    confirmDialog: {
      title: "Confirm",
      message:
        "Are you sure you want to dismiss and not show again for future updates? You can always re-enable this popup in the settings page.",
      cancel: "Cancel",
      confirm: "I understand",
    },
    dismiss: "Dismiss",
  },
} as const satisfies LanguageMessages;
