import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage: "Spenden Sie, um das Projekt am Leben zu erhalten!",
  },
  sponsorDialog: {
    title: "Complexity Braucht Ihre Hilfe!",
    description:
      "Unzählige Stunden wurden investiert, um Complexity zu einem leistungsstarken und ausgefeilten Werkzeug für Sie zu machen. Ihre Unterstützung treibt direkt die kontinuierliche Entwicklung, neue Funktionen und hält alles reibungslos am Laufen.",
    descriptionLine2:
      "Wenn Complexity Ihren Arbeitsablauf bereichert, erwägen Sie bitte, zu seiner Zukunft beizutragen!",
    cometAffiliate: {
      title: "🎁 Holen Sie sich Ihr kostenloses <0>PERPLEXITY PRO</0>!",
      description:
        "Wenn Sie sich über diesen Affiliate-Link anmelden, erhalten Sie im ersten Monat ein kostenloses <0>PERPLEXITY PRO</0>-Abonnement und tragen gleichzeitig direkt zur Entwicklung von Complexity bei.",
      claimButton: "Jetzt beanspruchen",
      dismissButton: "Schließen",
    },
    donation: {
      title: "💖 Spenden Sie",
    },
    sponsorship: {
      title: "🌟 Haben Sie ein Angebot für langfristiges Sponsoring?",
      contactEmail: "Kontakt per E-Mail",
    },
  },
  misc: {
    words: "Wörter",
    characters: "Zeichen",
    rewrite: "Umschreiben",
    speakAloud: "Laut vorlesen",
    stop: "Stoppen",
  },
  releaseNotes: {
    title: "Auf v{version} aktualisiert",
    dontShowAgain: "Schließen und für zukünftige Updates nicht mehr anzeigen",
    confirmDialog: {
      title: "Bestätigen",
      message:
        "Sind Sie sicher, dass Sie schließen und für zukünftige Updates nicht mehr anzeigen möchten? Sie können dieses Popup jederzeit auf der Einstellungsseite wieder aktivieren.",
      cancel: "Abbrechen",
      confirm: "Ich verstehe",
    },
    dismiss: "Schließen",
  },
} as const satisfies Translations;
