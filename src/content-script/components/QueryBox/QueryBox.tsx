import $ from 'jquery';
import { LoaderCircle } from 'lucide-react';
import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import useQueryBoxObserver from '@/content-script/hooks/useQueryBoxObserver';
import { useGlobalStore } from '@/content-script/session-store/global';
import { usePopupSettingsStore } from '@/content-script/session-store/popup-settings';
import {
  initQueryBoxStore,
  useQueryBoxStore,
} from '@/content-script/session-store/query-box';
import PPLXApi from '@/services/PPLXApi';
import KeyCombo from '@/shared/components/KeyCombo';
import { Separator } from '@/shared/components/shadcn/ui/separator';
import { useToast } from '@/shared/components/shadcn/ui/use-toast';
import { LanguageModel } from '@/types/ModelSelector';
import UIUtils from '@/utils/UI';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import CollectionSelector from './CollectionSelector';
import FocusSelector from './FocusSelector';
import ImageModelSelector, { ImageModel } from './ImageModelSelector';
import LanguageModelSelector from './LanguageModelSelector';
import QuickQueryCommander from './QuickQueryCommander';

export default function QueryBox() {
  const isReady = useGlobalStore(
    (state) => state.isWebSocketCaptured || state.isLongPollingCaptured
  );

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
    queryFn: PPLXApi.fetchUserSettings,
    refetchInterval: 10000,
    ...queryOptions,
    enabled: !$(document.body).hasClass('no-js'),
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
    queryFn: PPLXApi.fetchUserProfileSettings,
    enabled: isReady,
  });

  useQuery({
    queryKey: ['collections'],
    queryFn: PPLXApi.fetchCollections,
  });

  const { setQueryLimit, setOpusLimit, setImageCreateLimit } = useQueryBoxStore(
    (state) => state
  );

  const { toggleWebAccess } = useQueryBoxStore((state) => state.webAccess);

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

  const memoizedSetContainers = useCallback((newContainer: Element) => {
    setContainers((prevContainers) =>
      [...prevContainers, newContainer].filter((x) => document.contains(x))
    );
  }, []);

  const memoizedSetFollowUpContainers = useCallback((newContainer: Element) => {
    setFollowUpContainers((prevFollowUpContainers) =>
      [...prevFollowUpContainers, newContainer].filter((x) =>
        document.contains(x)
      )
    );
  }, []);

  useQueryBoxObserver({
    setContainers: memoizedSetContainers,
    setFollowUpContainers: memoizedSetFollowUpContainers,
    refetchUserSettings,
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
    const down = (
      e: JQuery.TriggeredEvent<Document, undefined, Document, Document>
    ) => {
      if (e.altKey && e.key === '.') {
        e.preventDefault();
        toggleWebAccess();
      }
    };

    $(document).on('keydown.toggleWebAccess', down);

    return () => {
      $(document).off('keydown.toggleWebAccess', down);
    };
  }, [toggleWebAccess]);

  const selectors = (
    <CommonSelectors
      isReady={isReady && !!userSettings && !isLoadingUserSettings}
      hasActivePPLXSub={!!hasActivePPLXSub}
      focus={focus}
      collection={collection}
      languageModel={languageModel}
      imageGenModel={imageGenModel}
    />
  );

  const followUpSelectors = (
    <CommonSelectors
      isReady={isReady && !!userSettings && !isLoadingUserSettings}
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
            !!UIUtils.getActiveQueryBox({ type: 'follow-up' }).length &&
            ReactDOM.createPortal(
              <>
                <QuickCommander
                  context="follow-up"
                  $trigger={UIUtils.getActiveQueryBox({ type: 'follow-up' })}
                  $textarea={
                    UIUtils.getActiveQueryBoxTextarea({
                      type: 'follow-up',
                    }) as JQuery<HTMLTextAreaElement>
                  }
                  searchValue={quickCommandSearchValue}
                  setQuickCommandSearchValue={setQuickCommandSearchValue}
                />
              </>,
              UIUtils.getActiveQueryBox({ type: 'follow-up' })[0]
            )}
        </Fragment>
      ))}
    </>
  );
}

const CommonSelectors = ({
  isReady,
  hasActivePPLXSub,
  focus,
  collection,
  languageModel,
  imageGenModel,
}: {
  isReady: boolean;
  hasActivePPLXSub: boolean;
  focus: boolean;
  collection?: boolean;
  languageModel: boolean;
  imageGenModel: boolean;
}) => {
  const [hint, setHint] = useState<ReactNode>('');

  useEffect(() => {
    setTimeout(() => {
      if (!isReady) {
        setHint(
          <span className="tw-flex tw-items-center tw-gap-1 tw-flex-wrap">
            Manually trigger Pro Search (
            <KeyCombo keys={['Ctrl/Cmd', 'i']} />) to speed up the loading.
          </span>
        );
      }
    }, 5000);
  }, [isReady]);

  return (
    <>
      {isReady ? (
        <>
          {(focus || collection) && (
            <>
              {focus && <FocusSelector />}
              {collection && <CollectionSelector />}
              {hasActivePPLXSub && (languageModel || imageGenModel) && (
                <div className="tw-h-8 tw-flex tw-items-center tw-my-auto">
                  <Separator
                    orientation="vertical"
                    className="tw-mx-2 !tw-h-[60%] tw-animate-in tw-fade-in"
                  />
                </div>
              )}
            </>
          )}
          {hasActivePPLXSub && languageModel && <LanguageModelSelector />}
          {hasActivePPLXSub && imageGenModel && <ImageModelSelector />}
        </>
      ) : (
        <div className="tw-flex tw-items-center tw-mx-2 tw-gap-2">
          <LoaderCircle className="tw-text-muted-foreground tw-animate-spin tw-size-4" />
          {hint && (
            <span className="tw-text-xs tw-text-muted-foreground tw-animate-in tw-fade-in tw-slide-in-from-right">
              {hint}
            </span>
          )}
        </div>
      )}
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
