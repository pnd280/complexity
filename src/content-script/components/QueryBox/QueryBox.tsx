import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import $ from "jquery";
import { LoaderCircle } from "lucide-react";
import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDom from "react-dom";

import useQueryBoxObserver from "@/content-script/hooks/useQueryBoxObserver";
import { useGlobalStore } from "@/content-script/session-store/global";
import {
  initQueryBoxStore,
  useQueryBoxStore,
} from "@/content-script/session-store/query-box";
import usePopupSettings from "@/popup-page/hooks/usePopupSettings";
import PplxApi from "@/services/PplxApi";
import KeyCombo from "@/shared/components/KeyCombo";
import { Separator } from "@/shared/components/shadcn/ui/separator";
import { useToast } from "@/shared/components/shadcn/ui/use-toast";

import CollectionSelector from "./CollectionSelector";
import FocusSelector from "./FocusSelector";
import ImageModelSelector from "./ImageModelSelector";
import LanguageModelSelector from "./LanguageModelSelector";

import { ImageModel, LanguageModel } from ".";

export default function QueryBox() {
  const isReady = useGlobalStore(
    (state) => state.isWebSocketCaptured || state.isLongPollingCaptured,
  );

  const { toast } = useToast();

  const isDefaultsInitialized = useRef({
    userSettings: false,
  });

  const { settings } = usePopupSettings();

  const autoRefreshSessionTimeout =
    settings?.qolTweaks.autoRefreshSessionTimeout;

  const queryOptions: Pick<
    UndefinedInitialDataOptions,
    "refetchIntervalInBackground" | "retry"
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
    queryKey: ["userSettings"],
    queryFn: PplxApi.fetchUserSettings,
    refetchInterval: 10000,
    ...queryOptions,
    enabled: !$(document.body).hasClass("no-js"),
  });

  useEffect(() => {
    if (!autoRefreshSessionTimeout) return;

    if (userSettingsError?.message === "Cloudflare timeout") {
      toast({
        title: "⚠️ Cloudflare timeout!",
        description: "Refreshing the page...",
        timeout: 3000,
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [userSettingsError, autoRefreshSessionTimeout, toast]);

  useQuery({
    queryKey: ["userProfileSettings"],
    queryFn: PplxApi.fetchUserProfileSettings,
    enabled: isReady,
  });

  useQuery({
    queryKey: ["collections"],
    queryFn: PplxApi.fetchCollections,
  });

  const { setQueryLimit, setOpusLimit, setImageCreateLimit } = useQueryBoxStore(
    (state) => state,
  );

  const { toggleWebAccess } = useQueryBoxStore((state) => state.webAccess);

  const { focus, imageGenModel, languageModel, collection } =
    settings?.queryBoxSelectors || {};

  const hasActivePplxSub =
    userSettings && userSettings.subscription_status === "active";

  useEffect(() => {
    if (userSettings) {
      if (!isDefaultsInitialized.current.userSettings) {
        initQueryBoxStore({
          imageModel:
            userSettings.default_image_generation_model as ImageModel["code"],
          languageModel: userSettings.default_model as LanguageModel["code"],
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

  const memoizedSetContainers = useCallback((newContainer: Element) => {
    setContainers((prevContainers) =>
      [...prevContainers, newContainer].filter((x) => document.contains(x)),
    );
  }, []);

  const memoizedSetFollowUpContainers = useCallback((newContainer: Element) => {
    setFollowUpContainers((prevFollowUpContainers) =>
      [...prevFollowUpContainers, newContainer].filter((x) =>
        document.contains(x),
      ),
    );
  }, []);

  useQueryBoxObserver({
    setContainers: memoizedSetContainers,
    setFollowUpContainers: memoizedSetFollowUpContainers,
    refetchUserSettings,
    disabled: !focus && !languageModel && !imageGenModel && !collection,
  });

  useEffect(() => {
    hasActivePplxSub === false &&
      toast({
        title: "⚠️ Some features are disabled!",
        description: "No active Perplexity subscription/Not logged in!",
        timeout: 3000,
      });
  }, [hasActivePplxSub, toast]);

  useEffect(() => {
    const down = (
      e: JQuery.TriggeredEvent<Document, undefined, Document, Document>,
    ) => {
      if (e.altKey && e.key === ".") {
        e.preventDefault();
        toggleWebAccess();
      }
    };

    $(document).on("keydown.toggleWebAccess", down);

    return () => {
      $(document).off("keydown.toggleWebAccess", down);
    };
  }, [toggleWebAccess]);

  const selectors = (
    <CommonSelectors
      isReady={isReady && !!userSettings && !isLoadingUserSettings}
      hasActivePplxSub={!!hasActivePplxSub}
      focus={!!focus}
      collection={collection}
      languageModel={!!languageModel}
      imageGenModel={!!imageGenModel}
    />
  );

  const followUpSelectors = (
    <CommonSelectors
      isReady={isReady && !!userSettings && !isLoadingUserSettings}
      hasActivePplxSub={!!hasActivePplxSub}
      focus={!!focus}
      languageModel={!!languageModel}
      imageGenModel={!!imageGenModel}
    />
  );

  return (
    <>
      {containers.map((container, index) => (
        <Fragment key={index}>
          {ReactDom.createPortal(selectors, container)}
        </Fragment>
      ))}
      {followUpContainers.map((container, index) => (
        <Fragment key={index}>
          {ReactDom.createPortal(followUpSelectors, container)}
        </Fragment>
      ))}
    </>
  );
}

const CommonSelectors = ({
  isReady,
  hasActivePplxSub,
  focus,
  collection,
  languageModel,
  imageGenModel,
}: {
  isReady: boolean;
  hasActivePplxSub: boolean;
  focus: boolean;
  collection?: boolean;
  languageModel: boolean;
  imageGenModel: boolean;
}) => {
  const [hint, setHint] = useState<ReactNode>("");

  useEffect(() => {
    setTimeout(() => {
      if (!isReady) {
        setHint(
          <span className="tw-flex tw-flex-wrap tw-items-center tw-gap-1">
            Manually trigger Pro Search (
            <KeyCombo keys={["Ctrl/Cmd", "i"]} />) to speed up the loading.
          </span>,
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
              {hasActivePplxSub && (languageModel || imageGenModel) && (
                <div className="tw-my-auto tw-flex tw-h-8 tw-items-center">
                  <Separator
                    orientation="vertical"
                    className="tw-mx-2 !tw-h-[60%] tw-animate-in tw-fade-in"
                  />
                </div>
              )}
            </>
          )}
          {hasActivePplxSub && languageModel && <LanguageModelSelector />}
          {hasActivePplxSub && imageGenModel && <ImageModelSelector />}
        </>
      ) : (
        <div className="tw-mx-2 tw-flex tw-items-center tw-gap-2">
          <LoaderCircle className="tw-size-4 tw-animate-spin tw-text-muted-foreground" />
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
