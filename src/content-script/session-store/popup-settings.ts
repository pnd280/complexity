import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { CanvasLang } from '@/utils/Canvas';
import ChromeStorage from '@/utils/ChromeStorage';
import { extensionExec } from '@/utils/hoc';

type PopupSettingsState = {
  queryBoxSelectors: {
    focus: boolean;
    languageModel: boolean;
    imageGenModel: boolean;
    collection: boolean;
  };
  qolTweaks: {
    threadTOC: boolean;
    quickQueryCommander: boolean;
    threadMessageStickyToolbar: boolean;
    alternateMarkdownBlock: boolean;
    canvas: {
      enabled: boolean;
      mask: Partial<Record<CanvasLang, boolean>>;
    };
    autoRefreshSessionTimeout: boolean;
    blockTelemetry: boolean;
  };
  visualTweaks: {
    collapseEmptyThreadVisualColumns: boolean;
  };
};

const usePopupSettingsStore = create<PopupSettingsState>()(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  immer((set, get) => ({
    queryBoxSelectors: {
      focus: false,
      languageModel: false,
      imageGenModel: false,
      collection: false,
    },
    qolTweaks: {
      threadTOC: false,
      quickQueryCommander: false,
      threadMessageStickyToolbar: false,
      alternateMarkdownBlock: false,
      canvas: {
        enabled: false,
        mask: {},
      },
      autoRefreshSessionTimeout: false,
      blockTelemetry: false,
    },
    visualTweaks: {
      collapseEmptyThreadVisualColumns: false,
    },
  }))
);

const popupSettingsStore = usePopupSettingsStore;

extensionExec(async function initPopupSettingsStore() {
  let settings = await ChromeStorage.getStorageValue('popupSettings');

  if (!settings) {
    await ChromeStorage.setStorageValue({
      key: 'popupSettings',
      value: {
        queryBoxSelectors: {
          focus: false,
          languageModel: false,
          imageGenModel: false,
          collection: false,
        },
        qolTweaks: {
          threadTOC: false,
          quickQueryCommander: false,
          threadMessageStickyToolbar: false,
          alternateMarkdownBlock: false,
          canvas: {
            enabled: false,
            mask: {},
          },
          autoRefreshSessionTimeout: false,
          blockTelemetry: false,
        },
        visualTweaks: {
          collapseEmptyThreadVisualColumns: false,
        },
      },
    });

    settings = await ChromeStorage.getStorageValue('popupSettings');
  }

  if (!settings) return;

  const queryBoxSelectors = settings.queryBoxSelectors;
  const qolTweaks = settings.qolTweaks;

  if (queryBoxSelectors) {
    popupSettingsStore.setState((state) => {
      state.queryBoxSelectors = queryBoxSelectors;
    });
  }

  if (qolTweaks) {
    popupSettingsStore.setState((state) => {
      state.qolTweaks = qolTweaks;
    });
  }

  if (settings.visualTweaks) {
    popupSettingsStore.setState((state) => {
      state.visualTweaks = settings.visualTweaks;
    });
  }

  popupSettingsStore.subscribe((state) => {
    ChromeStorage.setStorageValue({ key: 'popupSettings', value: state });
  });
})();

export { popupSettingsStore, usePopupSettingsStore };
