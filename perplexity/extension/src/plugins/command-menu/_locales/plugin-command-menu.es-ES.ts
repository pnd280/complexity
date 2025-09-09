import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Mostrar vistas previas",
    hidePreviews: "Ocultar vistas previas",
  },
  input: {
    searchPlaceholder: "Buscar...",
  },
  actions: {
    createNewThread: "Crear nuevo hilo",
    toggleIncognitoEnable: "Activar modo incógnito",
    toggleIncognitoDisable: "Desactivar modo incógnito",
    toggleLightMode: "Cambiar a modo claro",
    toggleDarkMode: "Cambiar a modo oscuro",
  },
  navigation: {
    home: "Inicio",
    library: "Biblioteca",
    spaces: "Espacios",
    discover: "Descubrir",
    settings: "Configuración",
    labs: "Laboratorios",
    current: "Actual",
    openInNewTab: "Abrir en nueva pestaña",
    goTo: "Ir a {destination}",
  },
  search: {
    threads: "Hilos",
    spaces: "Espacios",
    threadsPlaceholder: "Buscar hilos...",
    spacesPlaceholder: "Buscar espacios...",
  },
  groups: {
    actions: "Acciones",
    navigation: "Navegación",
    search: "Búsqueda",
  },
  spaces: {
    footer: {
      openInNewTab: "Abrir en nueva pestaña",
      searchInSpace: "Buscar en espacio",
      goToSpace: "Ir al espacio",
      searchSpacePlaceholder: "Buscar {spaceName}...",
    },
    commandItems: {
      errorFetching: "Error al obtener espacios",
      noSpacesFound: "No se encontraron espacios",
    },
    preview: {
      description: "Descripción",
      instructions: "Instrucciones",
      files: "Archivos ({count:number})",
      webLinks: "Enlaces web ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Error al obtener hilos",
      noThreadsFound: "No se encontraron hilos",
    },
    filters: {
      sort: {
        newest: "Más recientes",
        newestFirst: "Más recientes primero",
        oldest: "Más antiguos",
        oldestFirst: "Más antiguos primero",
        label: "Ordenar:",
      },
      source: {
        all: "Todos",
        label: "Fuente:",
      },
      temporaryThreads: {
        show: "Mostrar",
        hide: "Ocultar",
        label: "Hilos temporales:",
        placeholder: "Hilos temporales",
      },
      type: {
        all: "Todos",
        label: "Tipo:",
        placeholder: "Tipo",
      },
    },
  },
  common: {
    noResults: "No se encontraron resultados",
    current: "Actual",
  },
} as const satisfies Translations;
