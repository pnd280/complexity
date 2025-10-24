import type { Translations } from "@/plugins/command-menu/_locales/index";

export default {
  sidecar: {
    showPreviews: "Mostrar visualizações",
    hidePreviews: "Ocultar visualizações",
  },
  input: {
    searchPlaceholder: "Pesquisar...",
  },
  actions: {
    createNewThread: "Criar nova conversa",
    toggleIncognitoEnable: "Ativar modo incógnito",
    toggleIncognitoDisable: "Desativar modo incógnito",
    toggleLightMode: "Mudar para modo claro",
    toggleDarkMode: "Mudar para modo escuro",
  },
  navigation: {
    home: "Início",
    library: "Biblioteca",
    spaces: "Espaços",
    discover: "Descobrir",
    settings: "Configurações",
    labs: "Laboratórios",
    current: "Atual",
    openInNewTab: "Abrir em nova aba",
    goTo: "Ir para {destination}",
  },
  search: {
    threads: "Conversas",
    spaces: "Espaços",
    threadsPlaceholder: "Pesquisar conversas...",
    spacesPlaceholder: "Pesquisar espaços...",
  },
  groups: {
    actions: "Ações",
    navigation: "Navegação",
    search: "Pesquisa",
  },
  spaces: {
    footer: {
      copyId: "Copiar ID",
      copyIdSuccess: "✅ ID copiado para a área de transferência",
      openInNewTab: "Abrir em nova aba",
      searchInSpace: "Pesquisar no espaço",
      goToSpace: "Ir para o espaço",
      searchSpacePlaceholder: "Pesquisar {spaceName}...",
    },
    commandItems: {
      errorFetching: "Erro ao buscar espaços",
      noSpacesFound: "Nenhum espaço encontrado",
    },
    preview: {
      description: "Descrição",
      instructions: "Instruções",
      files: "Arquivos ({count:number})",
      webLinks: "Links da web ({count:number})",
    },
  },
  threads: {
    commandItems: {
      errorFetching: "Erro ao buscar conversas",
      noThreadsFound: "Nenhuma conversa encontrada",
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
        label: "Conversas temporárias:",
        placeholder: "Conversas temporárias",
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
    current: "Atual",
  },
} as const satisfies Translations;
