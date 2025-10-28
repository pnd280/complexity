import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage: "Fai una donazione per mantenere vivo il progetto!",
  },
  sponsorDialog: {
    title: "Aiuta a mantenere Complexity fantastico!",
    description:
      "Innumerevoli ore sono state dedicate per rendere Complexity uno strumento potente e raffinato per te. Il tuo supporto alimenta direttamente lo sviluppo continuo, nuove funzionalità e il mantenimento di tutto in modo efficiente.",
    descriptionLine2:
      "Se Complexity aggiunge valore al tuo flusso di lavoro, considera di contribuire al suo futuro!",
    cometAffiliate: {
      title: "Prova Comet - Ottieni un abbonamento <0/> gratuito!",
      description:
        "Prova Comet - il nuovo browser di Perplexity - e ottieni un abbonamento <0/> gratuito e contribuisci direttamente allo sviluppo di Complexity.",
      claimButton: "Richiedi ora",
      dismissButton: "Ignora",
    },
    donation: {
      title: "💖 Supporta lo sviluppo futuro",
    },
    sponsorship: {
      title: "🌟 Interessato alla sponsorizzazione?",
      contactEmail: "Contatta via Email",
    },
  },
  misc: {
    words: "parole",
    characters: "caratteri",
    rewrite: "Riscrivi",
    speakAloud: "Leggi ad alta voce",
    stop: "Ferma",
  },
  releaseNotes: {
    title: "Aggiornato alla v{version}",
    dontShowAgain: "Ignora e non mostrare più per i futuri aggiornamenti",
    confirmDialog: {
      title: "Conferma",
      message:
        "Sei sicuro di voler ignorare e non mostrare più per i futuri aggiornamenti? Puoi sempre riattivare questo popup nella pagina delle impostazioni.",
      cancel: "Annulla",
      confirm: "Ho capito",
    },
    dismiss: "Ignora",
  },
} as const satisfies Translations;
