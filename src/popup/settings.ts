const queryBoxSelectors = [
  {
    id: 'focus-selector',
    label: 'Web search focus',
    storeKey: 'focus',
  },
  {
    id: 'collection-selector',
    label: 'Collection',
    storeKey: 'collection',
  },
  {
    id: 'language-model-selector',
    label: 'Language Model',
    storeKey: 'languageModel',
  },
  {
    id: 'image-gen-model-selector',
    label: 'Image Generation Model',
    storeKey: 'imageGenModel',
  },
] as const;

const qolTweaks = [
  {
    id: 'thread-toc',
    label: 'Thread TOC',
    storeKey: 'threadTOC',
  },
  // {
  //   id: 'double-click-to-edit-query',
  //   label: 'Double click to edit query',
  //   storeKey: 'doubleClickToEditQuery',
  // },
  // {
  //   id: 'collection-quick-context-menu',
  //   label: 'Quick context menu on collection links (in thread)',
  //   storeKey: 'collectionQuickContextMenu',
  // },
] as const;

const visualTweaks = [
  {
    id: 'thread-query-markdown',
    label: 'Thread query markdown',
    storeKey: 'threadQueryMarkdown',
  },
  // {
  //   id: 'chat-ui', // image & avatar on top of every messages
  //   label: 'Chat UI',
  //   storeKey: 'chatUI',
  // },
  {
    id: 'collapse-empty-visual-columns',
    label: 'Collapse empty thread visual columns',
    storeKey: 'collapseEmptyThreadVisualColumns',
  },
  // {
  //   id: 'wider-thread-width',
  //   label: 'Wider thread width',
  //   storeKey: 'widerThreadWidth',
  // },
] as const;

const popupSettings = {
  queryBoxSelectors,
  qolTweaks,
  visualTweaks,
};

export default popupSettings;
