import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Collection } from '@/components/QueryBox/CollectionSelector';
import {
  isValidFocus,
  WebAccessFocus,
} from '@/components/QueryBox/FocusSelector';
import { ImageModel } from '@/components/QueryBox/ImageModelSelector';
import { LanguageModel } from '@/components/QueryBox/LanguageModelSelector';
import { chromeStorage } from '@/utils/chrome-store';
import { WSMessageParser } from '@/utils/ws';

import { webpageMessenger } from '../webpage/messenger';

type QueryBoxState = {
  selectedLanguageModel: LanguageModel['code'];
  setSelectedLanguageModel: (
    selectedLanguageModel: LanguageModel['code']
  ) => void;
  selectedImageModel: ImageModel['code'];
  setSelectedImageModel: (selectedImageModel: ImageModel['code']) => void;
  queryLimit: number;
  setQueryLimit: (queryLimit: number) => void;
  opusLimit: number;
  setOpusLimit: (opusLimit: number) => void;
  imageCreateLimit: number;
  setImageCreateLimit: (createLimit: number) => void;

  webAccess: {
    focus: WebAccessFocus['code'] | null;
    setFocus: (focus: WebAccessFocus['code'] | null) => void;
    allowWebAccess: boolean;
    toggleWebAccess: (toggled?: boolean) => void;
    proSearch: boolean;
    toggleProSearch: (toggled?: boolean) => void;
  };

  selectedCollectionUuid: Collection['uuid'];
  setSelectedCollectionUuid: (
    selectedCollectionUuid: Collection['uuid']
  ) => void;
};

const useQueryBoxStore = create<QueryBoxState>()(
  immer((set) => ({
    selectedLanguageModel: 'turbo',
    setSelectedLanguageModel: async (selectedLanguageModel) => {
      try {
        await webpageMessenger.sendMessage({
          event: 'sendWebsocketMessage',
          payload: WSMessageParser.stringify({
            messageCode: 423,
            event: 'save_user_settings',
            data: {
              default_model: selectedLanguageModel,
            },
          }),
        });

        return set({ selectedLanguageModel });
      } catch (e) {
        alert('Failed to change language model');
      }
    },
    selectedImageModel: 'default',
    setSelectedImageModel: async (selectedImageModel) => {
      try {
        await webpageMessenger.sendMessage({
          event: 'sendWebsocketMessage',
          payload: WSMessageParser.stringify({
            messageCode: 423,
            event: 'save_user_settings',
            data: {
              default_image_generation_model: selectedImageModel,
            },
          }),
        });

        return set({ selectedImageModel });
      } catch (e) {
        alert('Failed to change image model');
      }
    },
    queryLimit: 0,
    setQueryLimit: (queryLimit) => set({ queryLimit }),
    opusLimit: 0,
    setOpusLimit: (opusLimit) => set({ opusLimit }),
    imageCreateLimit: 0,
    setImageCreateLimit: (createLimit) =>
      set({ imageCreateLimit: createLimit }),

    webAccess: {
      focus: null,
      setFocus: (focus) =>
        set((state) => ({ webAccess: { ...state.webAccess, focus } })),

      allowWebAccess: false,
      toggleWebAccess: (toggled) =>
        set((state) => ({
          webAccess: {
            ...state.webAccess,
            allowWebAccess: toggled ?? !state.webAccess.allowWebAccess,
          },
        })),

      proSearch: false,
      toggleProSearch: async (toggled) => {
        try {
          await webpageMessenger.sendMessage({
            event: 'sendWebsocketMessage',
            payload: WSMessageParser.stringify({
              messageCode: 423,
              event: 'save_user_settings',
              data: {
                default_copilot: toggled,
              },
            }),
          });

          return set((state) => ({
            webAccess: {
              ...state.webAccess,
              proSearch: toggled ?? !state.webAccess.proSearch,
            },
          }));
        } catch (e) {
          alert('Failed to save pro search state.');
        }
      },
    },

    selectedCollectionUuid: '',
    setSelectedCollectionUuid: (selectedCollectionUuid) =>
      set({ selectedCollectionUuid }),
  }))
);

const queryBoxStore = useQueryBoxStore;

async function initQueryBoxStore({
  languageModel,
  imageModel,
  proSearch,
}: {
  languageModel?: LanguageModel['code'];
  imageModel?: ImageModel['code'];
  proSearch?: boolean;
}) {
  const { defaultFocus, defaultWebAccess } = await chromeStorage.getStore();
  if (isValidFocus(defaultFocus)) {
    queryBoxStore.setState((state) => {
      state.webAccess.focus = defaultFocus;
    });
  }

  queryBoxStore.setState((state) => {
    state.webAccess.allowWebAccess = defaultWebAccess;
  });

  queryBoxStore.setState((state) => {
    state.selectedLanguageModel = languageModel || state.selectedLanguageModel;
    state.selectedImageModel = imageModel || state.selectedImageModel;
  });
  queryBoxStore.setState((state) => {
    state.webAccess.proSearch = proSearch ?? state.webAccess.proSearch;
  });
}

initQueryBoxStore({});

export { initQueryBoxStore, queryBoxStore, useQueryBoxStore };
