import { useQuery } from "@tanstack/react-query";
import $ from "jquery";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  ImageModel,
  LanguageModel,
} from "@/content-script/components/QueryBox";
import CommonSelectors from "@/content-script/components/QueryBox/CommonSelectors";
import ImageModelSelector from "@/content-script/components/QueryBox/ImageModelSelector";
import useQueryBoxObserver from "@/content-script/hooks/useQueryBoxObserver";
import { useGlobalStore } from "@/content-script/session-store/global";
import {
  initQueryBoxStore,
  useQueryBoxStore,
} from "@/content-script/session-store/query-box";
import usePopupSettings from "@/popup-page/hooks/usePopupSettings";
import PplxApi from "@/services/PplxApi";
import Portal from "@/shared/components/Portal";

export default function QueryBox() {
  const isNetworkInstanceCaptured = useGlobalStore(
    (state) => state.isWebSocketCaptured || state.isLongPollingCaptured,
  );

  const isDefaultsInitialized = useRef({
    userSettings: false,
  });

  const { settings } = usePopupSettings();

  const { focus, imageGenModel, languageModel, collection } =
    settings?.queryBoxSelectors || {};

  const {
    data: userSettings,
    isLoading: isLoadingUserSettings,
    refetch: refetchUserSettings,
    error: userSettingsFetchError,
  } = useQuery({
    queryKey: ["userSettings"],
    queryFn: PplxApi.fetchUserSettings,
    retry: (failureCount, error) => {
      if (error.name === "ZodError") return false;

      if (failureCount > 3) {
        return false;
      }

      return true;
    },
  });

  const hasActivePplxSub =
    userSettings && userSettings.subscriptionStatus === "active";

  useQuery({
    queryKey: ["userProfileSettings"],
    queryFn: PplxApi.fetchUserProfileSettings,
    enabled: isNetworkInstanceCaptured,
  });

  useQuery({
    queryKey: ["collections"],
    queryFn: PplxApi.fetchCollections,
  });

  const { setQueryLimit, setOpusLimit, setImageCreateLimit } = useQueryBoxStore(
    (state) => state,
  );

  const { toggleWebAccess } = useQueryBoxStore((state) => state.webAccess);

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
  const [imageGenPopoverContainer, setImageGenPopoverContainer] =
    useState<HTMLElement>();

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
    setImageGenPopoverContainer,
    refetchUserSettings,
  });

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

  const isReady =
    (isNetworkInstanceCaptured && !!userSettings && !isLoadingUserSettings) ||
    !!userSettingsFetchError;

  const selectors = (
    <CommonSelectors
      isReady={isReady}
      hasActivePplxSub={!!hasActivePplxSub}
      focus={!!focus}
      collection={collection}
      languageModel={!!languageModel}
    />
  );

  const followUpSelectors = (
    <CommonSelectors
      isReady={isReady}
      hasActivePplxSub={!!hasActivePplxSub}
      focus={!!focus}
      languageModel={!!languageModel}
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
      {imageGenPopoverContainer && (
        <Portal container={imageGenPopoverContainer}>
          <div className="tw-mb-2 tw-w-max">
            {imageGenModel && <ImageModelSelector />}
          </div>
        </Portal>
      )}
    </>
  );
}
