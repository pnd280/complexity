import {
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import {
  usePopupSettingsStore,
} from '@/content-script/session-store/popup-settings';
import { useQueryBoxStore } from '@/content-script/session-store/query-box';
import pplxApi from '@/utils/pplx-api';
import { useQuery } from '@tanstack/react-query';

import useQueryBoxObserver from '../hooks/useQueryBoxObserver';
import { Separator } from '../ui/separator';
import CollectionSelector from './CollectionSelector';
import FocusSelector from './FocusSelector';
import ImageModelSelector, { ImageModel } from './ImageModelSelector';
import LanguageModelSelector, { LanguageModel } from './LanguageModelSelector';

export default function QueryBox() {
  const isDefaultsInitialized = useRef({
    userSettings: false,
    collections: false,
  });

  const {
    data: userSettings,
    isLoading,
    refetch: refetchUserSettings,
  } = useQuery({
    queryKey: ['userSettings'],
    queryFn: pplxApi.fetchUserSettings,
  });

  const { refetch: refetchCollections } = useQuery({
    queryKey: ['collections'],
    queryFn: pplxApi.fetchCollections,
    enabled: false,
    initialData: [],
  });

  const {
    setSelectedLanguageModel,
    setSelectedImageModel,
    setQueryLimit,
    setOpusLimit,
    setImageCreateLimit,
  } = useQueryBoxStore((state) => state);

  const { toggleProSearch, toggleWebAccess, allowWebAccess, proSearch } =
    useQueryBoxStore((state) => state.webAccess);

  useEffect(() => {
    if (userSettings) {
      if (!isDefaultsInitialized.current.userSettings) {
        setSelectedLanguageModel(
          userSettings.default_model as LanguageModel['code']
        );
        setSelectedImageModel(
          userSettings.default_image_generation_model as ImageModel['code']
        );
        toggleProSearch(userSettings.default_copilot);

        isDefaultsInitialized.current.userSettings = true;
      }

      setQueryLimit(userSettings.gpt4_limit);
      setOpusLimit(userSettings.opus_limit);
      setImageCreateLimit(userSettings.create_limit);
    }
  }, [userSettings]);

  const { focus, imageGenModel, languageModel, collection } =
    usePopupSettingsStore((state) => state.queryBoxSelectors);

  const [containers, setContainers] = useState<Element[]>([]);
  const [followUpContainers, setFollowUpContainers] = useState<Element[]>([]);

  useQueryBoxObserver({
    setContainers: (newContainer) =>
      setContainers([...containers, newContainer]),
    setFollowUpContainers: (newContainer) =>
      setFollowUpContainers([...followUpContainers, newContainer]),
    refetchUserSettings,
    refetchCollections,
    disabled: !focus && !languageModel && !imageGenModel && !collection,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.altKey && e.key === '.') {
        e.preventDefault();
        toggleWebAccess();
      }

      if (e.ctrlKey && e.key === '.') {
        e.preventDefault();
        toggleProSearch();

        !proSearch && !allowWebAccess && toggleWebAccess(true);
      }
    };

    document.addEventListener('keydown', down);

    return () => {
      document.removeEventListener('keydown', down);
    };
  }, []);

  if (!userSettings || isLoading) return null;

  const selectors = (
    <CommonSelectors
      focus={focus}
      collection={collection}
      languageModel={languageModel}
      imageGenModel={imageGenModel}
      includeCollection={true}
    />
  );

  const followUpSelectors = (
    <CommonSelectors
      focus={focus}
      collection={collection}
      languageModel={languageModel}
      imageGenModel={imageGenModel}
      includeCollection={false}
    />
  );

  return (
    <>
      {containers.map((container) =>
        ReactDOM.createPortal(selectors, container)
      )}
      {followUpContainers.map((container) =>
        ReactDOM.createPortal(followUpSelectors, container)
      )}
    </>
  );
}

const CommonSelectors = ({
  focus,
  collection,
  languageModel,
  imageGenModel,
  includeCollection,
}: {
  focus: boolean;
  collection: boolean;
  languageModel: boolean;
  imageGenModel: boolean;
  includeCollection: boolean;
}) => (
  <>
    {(focus || (includeCollection && collection)) && (
      <>
        {focus && <FocusSelector />}
        {includeCollection && collection && <CollectionSelector />}
        {(languageModel || imageGenModel) && (
          <>
            <div className="tw-h-8 tw-flex tw-items-center tw-my-auto">
              <Separator
                orientation="vertical"
                className="tw-mx-2 !tw-h-[60%] tw-animate-in tw-zoom-in"
              />
            </div>
          </>
        )}
      </>
    )}
    {languageModel && <LanguageModelSelector />}
    {imageGenModel && <ImageModelSelector />}
  </>
);
