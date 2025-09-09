import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage:
      "Bitte erwägen Sie, ein <0>Unterstützer</0> zu werden, um das Projekt am Leben zu erhalten!",
  },
  sponsorDialog: {
    title: "Complexity Braucht Ihre Hilfe!",
    description:
      "Diese raffinierte und funktionsreiche Erweiterung ist das Ergebnis unzähliger Stunden der Entwicklung und Verbesserung. Wenn Sie die Liebe zum Detail und die kontinuierlichen Verbesserungen schätzen, erwägen Sie bitte, die Entwicklung zu unterstützen",
    descriptionLine2:
      "Wenn Complexity Ihren Arbeitsablauf bereichert, erwägen Sie bitte, zu seiner Zukunft beizutragen!",
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
