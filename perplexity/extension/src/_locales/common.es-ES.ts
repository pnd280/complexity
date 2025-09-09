import type { Translations } from "@/_locales/index";

export default {
  sidebar: {
    supporterMessage:
      "¡Por favor, considera convertirte en un <0>Colaborador</0> para mantener el proyecto vivo!",
  },
  sponsorDialog: {
    title: "¡Ayuda a mantener Complexity increíble!",
    description:
      "Hemos dedicado innumerables horas a hacer de Complexity una herramienta poderosa y pulida para ti. Tu apoyo alimenta directamente el desarrollo continuo, nuevas funciones y el buen funcionamiento de todo.",
    descriptionLine2:
      "Si Complexity aporta valor a tu flujo de trabajo, ¡considera contribuir a su futuro!",
    donation: {
      title: "💖 Apoya el desarrollo futuro",
    },
    sponsorship: {
      title: "🌟 ¿Interesado en patrocinio?",
      contactEmail: "Contactar por correo electrónico",
    },
  },
  misc: {
    words: "palabras",
    characters: "caracteres",
    rewrite: "Reescribir",
    speakAloud: "Leer en voz alta",
    stop: "Detener",
  },
  releaseNotes: {
    title: "Actualizado a v{version}",
    dontShowAgain:
      "Descartar y no mostrar de nuevo para futuras actualizaciones",
    confirmDialog: {
      title: "Confirmar",
      message:
        "¿Estás seguro de que deseas descartar y no mostrar de nuevo para futuras actualizaciones? Siempre puedes volver a habilitar esta ventana emergente en la página de configuración.",
      cancel: "Cancelar",
      confirm: "Entiendo",
    },
    dismiss: "Descartar",
  },
} as const satisfies Translations;
