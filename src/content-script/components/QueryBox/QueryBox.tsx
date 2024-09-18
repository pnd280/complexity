import { useCallback, useState } from "react";

import CommonSelectors from "@/content-script/components/QueryBox/CommonSelectors";
import ImageModelSelector from "@/content-script/components/QueryBox/ImageModelSelector";
import useFetchUserSettings from "@/content-script/hooks/useFetchUserSettings";
import useInitQueryBoxSessionStore from "@/content-script/hooks/useInitQueryBoxSessionStore";
import useQueryBoxObserver from "@/content-script/hooks/useQueryBoxObserver";
import { useGlobalStore } from "@/content-script/session-store/global";
import useCplxGeneralSettings from "@/cplx-user-settings/hooks/useCplxGeneralSettings";
import Portal from "@/shared/components/Portal";

export default function QueryBox() {
  const isNetworkInstanceCaptured = useGlobalStore(
    (state) => state.isWebSocketCaptured,
  );

  const { settings } = useCplxGeneralSettings();

  const { focus, imageGenModel, languageModel, collection } =
    settings?.queryBoxSelectors || {};

  const {
    data: userSettings,
    isLoading: isLoadingUserSettings,
    refetch: refetchUserSettings,
    error: userSettingsFetchError,
  } = useFetchUserSettings();

  useInitQueryBoxSessionStore();

  const hasActivePplxSub =
    userSettings &&
    (userSettings.subscriptionStatus === "active" ||
      userSettings.subscriptionStatus === "trialing");

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
