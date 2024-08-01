import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import $ from "jquery";
import { LoaderCircle } from "lucide-react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import {
  ImageModel,
  LanguageModel,
} from "@/content-script/components/QueryBox";
import CollectionSelector from "@/content-script/components/QueryBox/CollectionSelector";
import FocusSelector from "@/content-script/components/QueryBox/FocusSelector";
import ImageModelSelector from "@/content-script/components/QueryBox/ImageModelSelector";
import LanguageModelSelector from "@/content-script/components/QueryBox/LanguageModelSelector";
import useQueryBoxObserver from "@/content-script/hooks/useQueryBoxObserver";
import { useGlobalStore } from "@/content-script/session-store/global";
import {
  initQueryBoxStore,
  useQueryBoxStore,
} from "@/content-script/session-store/query-box";
import usePopupSettings from "@/popup-page/hooks/usePopupSettings";
import PplxApi from "@/services/PplxApi";
import KeyCombo from "@/shared/components/KeyCombo";
import Portal from "@/shared/components/Portal";
import { Separator } from "@/shared/components/shadcn/ui/separator";
import { useToast } from "@/shared/components/shadcn/ui/use-toast";

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
  } = useQuery({
    queryKey: ["userSettings"],
    queryFn: PplxApi.fetchUserSettings,
    refetchInterval: 10000,
    ...queryOptions,
    enabled: !$(document.body).hasClass("no-js"),
  });

  const { data: userProfileSettings } = useQuery({
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
    userProfileSettings && userProfileSettings.user.subscription_status;

  useEffect(() => {
    if (userSettings) {
      if (!isDefaultsInitialized.current.userSettings) {
        initQueryBoxStore({
          imageModel:
            userSettings.defaultImageGenerationModel as ImageModel["code"],
          languageModel: userSettings.defaultModel as LanguageModel["code"],
        });

        isDefaultsInitialized.current.userSettings = true;
      }

      setQueryLimit(userSettings.gpt4Limit);
      setOpusLimit(userSettings.opusLimit);
      setImageCreateLimit(userSettings.createLimit);
    }
  }, [userSettings, setQueryLimit, setOpusLimit, setImageCreateLimit]);

  const [containers, setContainers] = useState<HTMLElement[]>([]);
  const [followUpContainers, setFollowUpContainers] = useState<HTMLElement[]>(
    [],
  );

  const memoizedSetContainers = useCallback((newContainer: HTMLElement) => {
    setContainers((prevContainers) =>
      [...prevContainers, newContainer].filter((x) => document.contains(x)),
    );
  }, []);

  const memoizedSetFollowUpContainers = useCallback(
    (newContainer: HTMLElement) => {
      setFollowUpContainers((prevFollowUpContainers) =>
        [...prevFollowUpContainers, newContainer].filter((x) =>
          document.contains(x),
        ),
      );
    },
    [],
  );

  useQueryBoxObserver({
    setContainers: memoizedSetContainers,
    setFollowUpContainers: memoizedSetFollowUpContainers,
    refetchUserSettings,
    disabled: !focus && !languageModel && !imageGenModel && !collection,
  });

  useEffect(() => {
    hasActivePplxSub &&
      hasActivePplxSub !== "active" &&
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
      hasActivePplxSub={hasActivePplxSub === "active"}
      focus={!!focus}
      collection={collection}
      languageModel={!!languageModel}
      imageGenModel={!!imageGenModel}
    />
  );

  const followUpSelectors = (
    <CommonSelectors
      isReady={isReady && !!userSettings && !isLoadingUserSettings}
      hasActivePplxSub={hasActivePplxSub === "active"}
      focus={!!focus}
      languageModel={!!languageModel}
      imageGenModel={!!imageGenModel}
    />
  );

  return (
    <>
      {containers.map((container, index) => (
        <Portal key={index} container={container}>
          {selectors}
        </Portal>
      ))}
      {followUpContainers.map((container, index) => (
        <Portal key={index} container={container}>
          {followUpSelectors}
        </Portal>
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
            Manually trigger Pro Search{" "}
            <span>
              (<KeyCombo keys={["Ctrl/Cmd", "i"]} />) to speed up the loading.
            </span>
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
