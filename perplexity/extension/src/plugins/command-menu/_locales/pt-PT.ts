import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Mostrar pré-visualizações",
    hidePreviews: "Ocultar pré-visualizações",
  },
  input: {
    searchPlaceholder: "Pesquisar...",
  },
  actions: {
    createNewThread: "Criar nova discussão",
    toggleIncognitoEnable: "Activar modo incógnito",
    toggleIncognitoDisable: "Desactivar modo incógnito",
    toggleLightMode: "Mudar para modo claro",
    toggleDarkMode: "Mudar para modo escuro",
  },
  navigation: {
    home: "Início",
    library: "Biblioteca",
    spaces: "Espaços",
    discover: "Descobrir",
    settings: "Definições",
    labs: "Laboratórios",
    current: "Actual",
    openInNewTab: "Abrir em novo separador",
    goTo: "Ir para {destination}",
  },
  search: {
    threads: "Discussões",
    spaces: "Espaços",
    threadsPlaceholder: "Pesquisar discussões...",
    spacesPlaceholder: "Pesquisar espaços...",
  },
  groups: {
    actions: "Acções",
    navigation: "Navegação",
    search: "Pesquisa",
  },
  spaces: {
    footer: {
      copyId: "Copiar ID",
      copyIdSuccess: "✅ ID copiado para a área de transferência",
      openInNewTab: "Abrir em novo separador",
      searchInSpace: "Pesquisar no espaço",
      goToSpace: "Ir para o espaço",
      searchSpacePlaceholder: "Pesquisar {spaceName}...",
    },
    commandItems: {
      errorFetching: "Erro ao obter espaços",
      noSpacesFound: "Nenhum espaço encontrado",
    },
    preview: {
      description: "Descrição",
      instructions: "Instruções",
      files: "Ficheiros ({count:number})",
      webLinks: "Ligações web ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Erro ao obter discussões",
      noThreadsFound: "Nenhuma discussão encontrada",
    },
    filters: {
      sort: {
        newest: "Mais recentes",
        newestFirst: "Mais recentes primeiro",
        oldest: "Mais antigas",
        oldestFirst: "Mais antigas primeiro",
        label: "Ordenar:",
      },
      source: {
        all: "Todas",
        label: "Origem:",
      },
      temporaryThreads: {
        show: "Mostrar",
        hide: "Ocultar",
        label: "Discussões temporárias:",
        placeholder: "Discussões temporárias",
      },
      type: {
        all: "Todas",
        label: "Tipo:",
        placeholder: "Tipo",
      },
    },
  },
  common: {
    noResults: "Nenhum resultado encontrado",
    current: "Actual",
    expires: "Expira {date}",
  },
} as const satisfies Translations;
