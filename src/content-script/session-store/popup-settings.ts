import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { chromeStorage } from '@/utils/chrome-store';

type PopupSettingsState = {
  queryBoxSelectors: {
    focus: boolean;
    languageModel: boolean;
    imageGenModel: boolean;
  };
  usefulTweaks: {
    threadTOC: boolean;
    doubleClickToEditQuery: boolean;
    collectionQuickContextMenu: boolean;
  };
  visualTweaks: {
    threadQueryMarkdown: boolean;
    chatUI: boolean;
    collapseEmptyVisualColumns: boolean;
    widerThreadWidth: boolean;
  };
};

const usePopupSettingsStore = create<PopupSettingsState>()(
  immer((set) => ({
    queryBoxSelectors: {
      focus: false,
      languageModel: false,
      imageGenModel: false,
    },
    usefulTweaks: {
      threadTOC: false,
      doubleClickToEditQuery: false,
      collectionQuickContextMenu: false,
    },
    visualTweaks: {
      threadQueryMarkdown: false,
      chatUI: false,
      collapseEmptyVisualColumns: false,
      widerThreadWidth: false,
    },
  }))
);

const popupSettingsStore = usePopupSettingsStore;

(async function initPopupSettingsStore() {
  const settings = await chromeStorage.getStorageValue('popupSettings');

  const queryBoxSelectors = settings.queryBoxSelectors;

  if (queryBoxSelectors) {
    popupSettingsStore.setState((state) => {
      state.queryBoxSelectors = queryBoxSelectors;
    });
  }

  popupSettingsStore.subscribe((state) => {
    chromeStorage.setStorageValue({ key: 'popupSettings', value: state });
  });
})();

export { popupSettingsStore, usePopupSettingsStore };
