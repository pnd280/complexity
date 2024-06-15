import {
  Fragment,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';

import { useGlobalStore } from '@/content-script/session-store/global';
import {
  usePopupSettingsStore,
} from '@/content-script/session-store/popup-settings';
import {
  initQueryBoxStore,
  useQueryBoxStore,
} from '@/content-script/session-store/query-box';
import { LanguageModel } from '@/types/ModelSelector';
import pplxApi from '@/utils/pplx-api';
import { ui } from '@/utils/ui';
import {
  UndefinedInitialDataOptions,
  useQuery,
} from '@tanstack/react-query';

import useQueryBoxObserver from '../hooks/useQueryBoxObserver';
import { Separator } from '../ui/separator';
import { useToast } from '../ui/use-toast';
import CollectionSelector from './CollectionSelector';
import FocusSelector from './FocusSelector';
import ImageModelSelector, { ImageModel } from './ImageModelSelector';
import LanguageModelSelector from './LanguageModelSelector';
import QuickQueryCommander from './QuickQueryCommander';

export default function QueryBox() {
  const isReady = useGlobalStore((state) => state.isWebSocketCaptured);

  const { toast } = useToast();

  const isDefaultsInitialized = useRef({
    userSettings: false,
  });

  const autoRefreshSessionTimeout = usePopupSettingsStore(
    (state) => state.qolTweaks.autoRefreshSessionTimeout
  );

  const queryOptions: Pick<
    UndefinedInitialDataOptions,
    'refetchIntervalInBackground' | 'retry'
  > = autoRefreshSessionTimeout
    ? {
        refetchIntervalInBackground: true,
        retry: false,
      }
    : {};

  const {
    data: userSettings,
    isLoading: isLoadingUserSettings,
    refetch: refetchUserSettings,
    error: userSettingsError,
  } = useQuery({
    queryKey: ['userSettings'],
    queryFn: pplxApi.fetchUserSettings,
    refetchInterval: 10000,
    ...queryOptions,
  });

  useEffect(() => {
    if (!autoRefreshSessionTimeout) return;

    if (userSettingsError?.message === 'Cloudflare timeout') {
      toast({
        title: '⚠️ Cloudflare timeout!',
        description: 'Refreshing the page...',
        timeout: 3000,
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [userSettingsError, autoRefreshSessionTimeout, toast]);

  useQuery({
    queryKey: ['userProfileSettings'],
    queryFn: pplxApi.fetchUserProfileSettings,
    enabled: isReady,
  });

  const { refetch: refetchCollections } = useQuery({
    queryKey: ['collections'],
    queryFn: pplxApi.fetchCollections,
    enabled: false,
  });

  const { setQueryLimit, setOpusLimit, setImageCreateLimit } = useQueryBoxStore(
    (state) => state
  );

  const { toggleProSearch, toggleWebAccess, allowWebAccess, proSearch } =
    useQueryBoxStore((state) => state.webAccess);

  const { focus, imageGenModel, languageModel, collection } =
    usePopupSettingsStore((state) => state.queryBoxSelectors);

  const { quickQueryCommander } = usePopupSettingsStore(
    (state) => state.qolTweaks
  );

  const hasActivePPLXSub =
    userSettings && userSettings.subscription_status === 'active';

  useEffect(() => {
    if (userSettings) {
      if (!isDefaultsInitialized.current.userSettings) {
        initQueryBoxStore({
          imageModel:
            userSettings.default_image_generation_model as ImageModel['code'],
          languageModel: userSettings.default_model as LanguageModel['code'],
        });

        isDefaultsInitialized.current.userSettings = true;
      }

      setQueryLimit(userSettings.gpt4_limit);
      setOpusLimit(userSettings.opus_limit);
      setImageCreateLimit(userSettings.create_limit);
    }
  }, [userSettings, setQueryLimit, setOpusLimit, setImageCreateLimit]);

  const [containers, setContainers] = useState<Element[]>([]);
  const [followUpContainers, setFollowUpContainers] = useState<Element[]>([]);
  const [quickCommandSearchValue, setQuickCommandSearchValue] = useState('');

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
    hasActivePPLXSub === false &&
      toast({
        title: '⚠️ Some features are disabled!',
        description: 'No active Perplexity subscription/Not logged in!',
        timeout: 3000,
      });
  }, [hasActivePPLXSub, toast]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.altKey && e.key === '.') {
        e.preventDefault();
        toggleWebAccess();
      }

      if (hasActivePPLXSub && e.ctrlKey && e.key === '.') {
        e.preventDefault();
        toggleProSearch(!proSearch);

        if (!allowWebAccess) {
          toggleWebAccess(true);
          toggleProSearch(true);
        }
      }
    };

    document.addEventListener('keydown', down);

    return () => {
      document.removeEventListener('keydown', down);
    };
  }, [
    hasActivePPLXSub,
    proSearch,
    allowWebAccess,
    toggleProSearch,
    toggleWebAccess,
  ]);

  if (!userSettings || isLoadingUserSettings) return null;

  const selectors = (
    <CommonSelectors
      hasActivePPLXSub={!!hasActivePPLXSub}
      focus={focus}
      collection={collection}
      languageModel={languageModel}
      imageGenModel={imageGenModel}
    />
  );

  const followUpSelectors = (
    <CommonSelectors
      hasActivePPLXSub={!!hasActivePPLXSub}
      focus={focus}
      languageModel={languageModel}
      imageGenModel={imageGenModel}
    />
  );

  return (
    <>
      {containers.map((container, index) => (
        <Fragment key={index}>
          {ReactDOM.createPortal(selectors, container)}
          {quickQueryCommander &&
            ReactDOM.createPortal(
              <>
                <QuickCommander
                  context="main"
                  $trigger={$(container).parents('.grow.block')}
                  $textarea={
                    $(container)
                      .parents('.grow.block')
                      .find(
                        'textarea[placeholder="Ask anything..."]'
                      ) as JQuery<HTMLTextAreaElement>
                  }
                  searchValue={quickCommandSearchValue}
                  setQuickCommandSearchValue={setQuickCommandSearchValue}
                />
              </>,
              $(container).parents('.grow.block')[0]
            )}
        </Fragment>
      ))}
      {followUpContainers.map((container, index) => (
        <Fragment key={index}>
          {ReactDOM.createPortal(followUpSelectors, container)}
          {quickQueryCommander &&
            ui.findActiveQueryBox({ type: 'follow-up' }).length &&
            ReactDOM.createPortal(
              <>
                <QuickCommander
                  context="follow-up"
                  $trigger={ui.findActiveQueryBox({ type: 'follow-up' })}
                  $textarea={
                    ui.findActiveQueryBoxTextarea({
                      type: 'follow-up',
                    }) as JQuery<HTMLTextAreaElement>
                  }
                  searchValue={quickCommandSearchValue}
                  setQuickCommandSearchValue={setQuickCommandSearchValue}
                />
              </>,
              ui.findActiveQueryBox({ type: 'follow-up' })[0]
            )}
        </Fragment>
      ))}
    </>
  );
}

const CommonSelectors = ({
  hasActivePPLXSub,
  focus,
  collection,
  languageModel,
  imageGenModel,
}: {
  hasActivePPLXSub: boolean;
  focus: boolean;
  collection?: boolean;
  languageModel: boolean;
  imageGenModel: boolean;
}) => {
  return (
    <>
      {(focus || collection) && (
        <>
          {focus && <FocusSelector />}
          {collection && <CollectionSelector />}
          {hasActivePPLXSub && (languageModel || imageGenModel) && (
            <div className="tw-h-8 tw-flex tw-items-center tw-my-auto">
              <Separator
                orientation="vertical"
                className="tw-mx-2 !tw-h-[60%] tw-animate-in tw-zoom-in"
              />
            </div>
          )}
        </>
      )}
      {hasActivePPLXSub && languageModel && <LanguageModelSelector />}
      {hasActivePPLXSub && imageGenModel && <ImageModelSelector />}
    </>
  );
};

const QuickCommander = ({
  context,
  $trigger,
  $textarea,
  searchValue,
  setQuickCommandSearchValue,
}: {
  context: 'main' | 'follow-up';
  $trigger: JQuery<HTMLElement>;
  $textarea: JQuery<HTMLTextAreaElement>;
  searchValue: string;
  setQuickCommandSearchValue: (value: string) => void;
}) => {
  return (
    <>
      {ReactDOM.createPortal(
        <QuickQueryCommander
          context={context}
          $trigger={$trigger}
          $textarea={$textarea}
          searchValue={searchValue.slice(1)}
          setQuickCommandSearchValue={setQuickCommandSearchValue}
        />,
        $('#complexity-root')[0]
      )}
    </>
  );
};
